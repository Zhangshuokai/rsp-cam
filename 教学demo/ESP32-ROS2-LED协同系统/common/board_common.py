import socket
import time

from machine import Pin

try:
    from neopixel import NeoPixel
except ImportError:
    NeoPixel = None

try:
    import wifi_config as _cfg
except ImportError:
    _cfg = None

LED_PIN = 48  # onboard WS2812 on the ESP32-S3 boards; absent on the XRS pad
HEARTBEAT_MS = 4000
RETRY_MS = 4000
WIFI_TIMEOUT_MS = 20000
WOULD_BLOCK = (11, 110)  # EAGAIN / ETIMEDOUT on a non-blocking recv
DEFAULT_PERIOD_MS = 500
MIN_PERIOD_MS = 20
WHITE = (100, 100, 100)
TICK_MS = 20  # main-loop tick: keeps pad keys and blinks responsive
KEY_STEP_MS = 100  # pad UP/DOWN period step
KEY_PERIOD_MIN = 50
KEY_PERIOD_MAX = 5000
KEY_NAMES = ("UP", "DOWN", "LEFT", "RIGHT", "A", "B")


def _init_pixels():
    """NeoPixel on GPIO48, or None on boards without that LED (XRS pad)."""
    if NeoPixel is None:
        return None
    try:
        np = NeoPixel(Pin(LED_PIN, Pin.OUT), 1)
        np[0] = (0, 0, 0)
        np.write()
        return np
    except (ValueError, OSError):
        return None


_np = _init_pixels()
_display = None
_keys = None
_last_rgb = None


def _screen_log(text):
    if _display is not None:
        _display.log(text)


def _screen_status(**kw):
    if _display is not None:
        _display.status(**kw)


def _pixels(rgb):
    global _last_rgb
    if rgb == _last_rgb:
        return
    _last_rgb = rgb
    if _display is not None:
        _display.led(rgb)
        return
    if _np is None:
        return
    _np[0] = rgb
    _np.write()


def _key_actions(state, key):
    """Apply one pad key to the style state; True when something changed."""
    if key in ("LEFT", "RIGHT"):
        state.next_style(-1 if key == "LEFT" else 1)
        return True
    if key in ("UP", "DOWN"):
        state.step_period(-KEY_STEP_MS if key == "UP" else KEY_STEP_MS)
        return True
    if key == "A":
        state.toggle_pattern()
        return True
    if key == "B":
        state.reset_active()
        return True
    return False


def _clamp(value):
    return max(0, min(255, int(value)))


STYLE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-"
MAX_STYLES = 16
DEFAULT_STYLE = "default"
CUSTOM_STYLE = "custom"
PLAY_PERIODS = 4  # loop iterations each style is shown while cycling
MIX_TICK_MS = 20  # minimum sampling interval for parallel (composite) play


def _valid_name(name):
    if not 1 <= len(name) <= 16:
        return False
    for ch in name:
        if ch not in STYLE_CHARS:
            return False
    return True


def _pattern_value(text):
    return "solid" if text.lower() in ("solid", "on", "steady") else "blink"


class StyleSet:
    """Named blink styles with CRUD, driven by control messages.

    ``default`` is the board's own colour/period and can never be deleted or
    overwritten, so the original green/blue blink is never lost. The quick
    shortcuts (``LED``/``COLOR``/``PERIOD``/``PATTERN``) edit the active style;
    when the immutable ``default`` is active they switch to and edit a
    ``custom`` style instead. ``RESET`` re-activates ``default`` without
    dropping any custom styles.

    Commands (space or comma separated):
        STYLE SET <name> <R> <G> <B> <PERIOD_MS> [solid|blink]  (save only)
        STYLE DEL <name>
        STYLE USE <name>          (activate)
        STYLE LIST
        PLAY <name> [<name> ...]  (cycle through these styles)
        PLAY STOP                 (stop cycling)
        MIX <name> [<name> ...]   (blend these styles in parallel)
        MIX STOP                  (stop blending)
        LED <R> <G> <B> <PERIOD_MS>
        COLOR <R> <G> <B>
        PERIOD <MS>          (alias BLINK)
        PATTERN solid|blink
        RESET                (alias DEFAULT)
    """

    def __init__(self, rgb, period_ms=DEFAULT_PERIOD_MS):
        self.default_rgb = rgb
        self.default_period = period_ms
        self.reset()

    def reset(self):
        self.styles = {
            DEFAULT_STYLE: {
                "rgb": self.default_rgb,
                "period": self.default_period,
                "pattern": "blink",
            }
        }
        self.active = DEFAULT_STYLE
        self.stop_play()
        self.stop_mix()

    def stop_play(self):
        self.playlist = []
        self.play_pos = 0
        self.play_left = 0

    def stop_mix(self):
        self.mixlist = []
        self.mix_t0 = 0

    def mixing(self):
        return bool(self.mixlist)

    def next_style(self, step):
        names = list(self.styles.keys())
        current = self.current_name()
        pos = names.index(current) if current in names else 0
        self.active = names[(pos + step) % len(names)]
        self.stop_play()
        self.stop_mix()

    def step_period(self, delta):
        period = max(KEY_PERIOD_MIN, min(KEY_PERIOD_MAX, self.period_ms + delta))
        self._edit(None, None, None, period, None)

    def toggle_pattern(self):
        self._edit(None, None, None, None, "blink" if self.solid else "solid")

    def reset_active(self):
        self.active = DEFAULT_STYLE
        self.stop_play()
        self.stop_mix()

    def start_mix(self, names, now):
        self.mixlist = list(names)
        self.mix_t0 = now

    def composite(self, now):
        """Colour of all mixed styles at ``now``: on/off OR, colours added."""
        t = time.ticks_diff(now, self.mix_t0)
        r = g = b = 0
        for name in self.mixlist:
            style = self.styles.get(name)
            if style is None:
                continue
            lit = True
            if style["pattern"] != "solid":
                lit = (t // style["period"]) % 2 == 0
            if lit:
                rgb = style["rgb"]
                r += rgb[0]
                g += rgb[1]
                b += rgb[2]
        return (min(255, r), min(255, g), min(255, b))

    def current(self):
        if self.playlist:
            style = self.styles.get(self.playlist[self.play_pos % len(self.playlist)])
            if style is not None:
                return style
        return self.styles.get(self.active) or self.styles[DEFAULT_STYLE]

    def current_name(self):
        if self.playlist:
            return self.playlist[self.play_pos % len(self.playlist)]
        return self.active

    def advance(self):
        """Advance the playlist; call once per loop iteration while running."""
        if not self.playlist:
            return
        self.play_left -= 1
        if self.play_left <= 0:
            self.play_pos = (self.play_pos + 1) % len(self.playlist)
            self.play_left = PLAY_PERIODS

    @property
    def rgb(self):
        return self.current()["rgb"]

    @property
    def period_ms(self):
        return self.current()["period"]

    @property
    def solid(self):
        return self.current()["pattern"] == "solid"

    def apply(self, line):
        """None if unrecognised, [] if applied, or reply lines to send back."""
        parts = line.replace(",", " ").split()
        if not parts:
            return None
        cmd = parts[0].upper()
        try:
            if cmd == "LED" and len(parts) == 5:
                self._edit(_clamp(parts[1]), _clamp(parts[2]), _clamp(parts[3]),
                           max(MIN_PERIOD_MS, int(parts[4])), None)
            elif cmd == "COLOR" and len(parts) == 4:
                self._edit(_clamp(parts[1]), _clamp(parts[2]), _clamp(parts[3]), None, None)
            elif cmd in ("PERIOD", "BLINK") and len(parts) == 2:
                self._edit(None, None, None, max(MIN_PERIOD_MS, int(parts[1])), None)
            elif cmd == "PATTERN" and len(parts) == 2:
                self._edit(None, None, None, None, _pattern_value(parts[1]))
            elif cmd in ("RESET", "DEFAULT"):
                self.active = DEFAULT_STYLE
                self.stop_play()
                self.stop_mix()
            elif cmd == "PLAY":
                return self._play(parts)
            elif cmd == "MIX":
                return self._mix(parts)
            elif cmd == "STYLE":
                return self._style(parts)
            else:
                return None
        except (ValueError, IndexError):
            return None
        return []

    def _play(self, parts):
        if len(parts) < 2 or parts[1].upper() in ("STOP", "OFF"):
            self.stop_play()
            return ["STYLE-OK PLAY STOP"]
        for name in parts[1:]:
            if name not in self.styles:
                return ["STYLE-ERR no-such-style %s" % name]
        self.stop_mix()
        self.playlist = list(parts[1:])
        self.play_pos = 0
        self.play_left = PLAY_PERIODS
        return ["STYLE-OK PLAY %d" % len(self.playlist)]

    def _mix(self, parts):
        if len(parts) < 2 or parts[1].upper() in ("STOP", "OFF"):
            self.stop_mix()
            return ["STYLE-OK MIX STOP"]
        for name in parts[1:]:
            if name not in self.styles:
                return ["STYLE-ERR no-such-style %s" % name]
        self.stop_play()
        self.start_mix(parts[1:], time.ticks_ms())
        return ["STYLE-OK MIX %d" % len(self.mixlist)]

    def _edit(self, r, g, b, period, pattern):
        self.stop_play()
        self.stop_mix()
        if self.active == DEFAULT_STYLE:
            self.styles[CUSTOM_STYLE] = {
                "rgb": self.default_rgb,
                "period": self.default_period,
                "pattern": "blink",
            }
            self.active = CUSTOM_STYLE
        style = self.styles[self.active]
        if r is not None:
            style["rgb"] = (r, g, b)
        if period is not None:
            style["period"] = period
        if pattern is not None:
            style["pattern"] = pattern

    def _style(self, parts):
        if len(parts) < 2:
            return ["STYLE-ERR usage"]
        sub = parts[1].upper()
        if sub == "LIST":
            out = []
            for name, style in self.styles.items():
                out.append("STYLE %s %d %d %d %d %s %d" % (
                    name, style["rgb"][0], style["rgb"][1], style["rgb"][2],
                    style["period"], style["pattern"],
                    1 if name == self.active else 0))
            out.append("MIXING %s" % (" ".join(self.mixlist) if self.mixlist else "-"))
            out.append("PLAYING %s" % (" ".join(self.playlist) if self.playlist else "-"))
            out.append("STYLE-END %d" % len(self.styles))
            return out
        if len(parts) < 3 or not _valid_name(parts[2]):
            return ["STYLE-ERR bad-name"]
        name = parts[2]
        if sub == "DEL":
            if name == DEFAULT_STYLE:
                return ["STYLE-ERR protected"]
            if name not in self.styles:
                return ["STYLE-ERR no-such-style"]
            del self.styles[name]
            if self.active == name:
                self.active = DEFAULT_STYLE
            if name in self.playlist:
                self.playlist = [x for x in self.playlist if x != name]
                self.play_pos = 0
                if not self.playlist:
                    self.play_left = 0
            if name in self.mixlist:
                self.mixlist = [x for x in self.mixlist if x != name]
            return ["STYLE-OK DEL %s" % name]
        if sub == "USE":
            if name not in self.styles:
                return ["STYLE-ERR no-such-style"]
            self.active = name
            self.stop_play()
            self.stop_mix()
            return ["STYLE-OK USE %s" % name]
        if sub in ("SET", "ADD", "UPDATE"):
            if name == DEFAULT_STYLE:
                return ["STYLE-ERR protected"]
            if len(parts) < 7:
                return ["STYLE-ERR usage"]
            if name not in self.styles and len(self.styles) >= MAX_STYLES:
                return ["STYLE-ERR too-many"]
            pattern = _pattern_value(parts[7]) if len(parts) > 7 else "blink"
            self.styles[name] = {
                "rgb": (_clamp(parts[3]), _clamp(parts[4]), _clamp(parts[5])),
                "period": max(MIN_PERIOD_MS, int(parts[6])),
                "pattern": pattern,
            }
            # Saving/updating a style does NOT switch the running blink; the
            # original keeps blinking until an explicit STYLE USE.
            return ["STYLE-OK SET %s" % name]
        return ["STYLE-ERR usage"]


class Link:
    """WiFi station + TCP client to the ROS 2 server (see wifi_config.py)."""

    def __init__(self, name, ansi):
        self.name = name
        self.ansi = ansi
        self.sock = None
        self.buf = ""
        self.last_try = 0

    def _log(self, text):
        print("\x1b[2;%dm[%s]\x1b[0m %s" % (self.ansi, self.name, text))

    def connect(self):
        if _cfg is None or self.sock is not None:
            return
        now = time.ticks_ms()
        if time.ticks_diff(now, self.last_try) < RETRY_MS:
            return
        self.last_try = now
        try:
            import network

            wlan = network.WLAN(network.STA_IF)
            wlan.active(True)
            if not wlan.isconnected():
                wlan.connect(_cfg.SSID, _cfg.PASSWORD)
                start = time.ticks_ms()
                while not wlan.isconnected():
                    if time.ticks_diff(time.ticks_ms(), start) > WIFI_TIMEOUT_MS:
                        self._log("wifi connect timeout")
                        return
                    time.sleep_ms(200)
            sock = socket.socket()
            sock.settimeout(5)
            sock.connect((_cfg.SERVER_IP, _cfg.SERVER_PORT))
            sock.send(("HELLO %s\n" % self.name).encode())
            sock.setblocking(False)
        except OSError as exc:
            self._log("connect failed: %s" % exc)
            return
        self.sock = sock
        self.buf = ""
        self._log("link up %s:%s" % (_cfg.SERVER_IP, _cfg.SERVER_PORT))

    def _drop(self):
        if self.sock is not None:
            try:
                self.sock.close()
            except OSError:
                pass
        self.sock = None
        self.buf = ""

    def send(self, line):
        if self.sock is None:
            self.connect()
            if self.sock is None:
                return False
        try:
            self.sock.send((line + "\n").encode())
            return True
        except OSError as exc:
            if not exc.args or exc.args[0] not in WOULD_BLOCK:
                self._drop()
            return False

    def lines(self):
        if self.sock is None:
            return []
        try:
            data = self.sock.recv(256)
        except OSError as exc:
            # Empty/again means "no data yet"; only a real error drops the link.
            if exc.args and exc.args[0] not in WOULD_BLOCK:
                self._drop()
            return []
        if not data:
            self._drop()
            self._log("link lost")
            return []
        self.buf += data.decode()
        out = []
        while "\n" in self.buf:
            line, self.buf = self.buf.split("\n", 1)
            line = line.strip()
            if line:
                out.append(line)
        return out


def blink(rgb, name, ansi, period_ms=DEFAULT_PERIOD_MS, display=None, keys=None):
    global _display, _keys
    if display is not None:
        _display = display
    if keys is not None:
        _keys = keys
    on = "\x1b[1;%dm[%s ON]\x1b[0m" % (ansi, name)
    off = "\x1b[2;%dm[%s OFF]\x1b[0m" % (ansi, name)
    rx_fmt = "\x1b[1;36m[RX %s]\x1b[0m" % name
    print("\x1b[1;%dm[%s]\x1b[0m online, port ready" % (ansi, name))

    link = Link(name, ansi)
    link.connect()
    if link.sock is not None:
        _pixels(WHITE)
        time.sleep_ms(200)

    state = StyleSet(rgb, period_ms)
    _screen_status(style=state.active, pattern="blink", period=state.period_ms,
                   link=link.sock is not None)
    seq = 0
    lit = False
    last_hb = time.ticks_ms()
    last_step = time.ticks_ms()
    shown = None
    link_up = link.sock is not None

    def press(key):
        print("\x1b[2;%dm[%s KEY %s]\x1b[0m" % (ansi, name, key))
        _screen_log("KEY " + key)
        if _key_actions(state, key):
            print("  -> key=%s style=%s r=%d g=%d b=%d period=%dms %s"
                  % (key, state.current_name(), state.rgb[0], state.rgb[1],
                     state.rgb[2], state.period_ms,
                     "solid" if state.solid else "blink"))
            _screen_status(style=state.current_name(),
                           pattern="solid" if state.solid else "blink",
                           period=state.period_ms,
                           play=" ".join(state.playlist),
                           mix=" ".join(state.mixlist))
            _pixels(WHITE)
        if _cfg is not None:
            link.send("KEY " + key)

    while True:
        now = time.ticks_ms()
        up = link.sock is not None
        if up != link_up:
            link_up = up
            _screen_log("link up" if up else "link lost")
            _screen_status(link=up)

        if _keys is not None:
            for key in _keys.events():
                press(key)

        step = time.ticks_diff(now, last_step) >= state.period_ms
        if step:
            last_step = now

        if state.mixing():
            _pixels(state.composite(now))
            label = "MIX " + "+".join(state.mixlist)
            if label != shown:
                shown = label
                print("\x1b[2;%dm[%s %s]\x1b[0m" % (ansi, name, label))
                _screen_status(mix="+".join(state.mixlist),
                               play=" ".join(state.playlist))
        else:
            name_now = state.current_name()
            if name_now != shown:
                shown = name_now
                if state.playlist:
                    print("\x1b[2;%dm[%s PLAY %s]\x1b[0m" % (ansi, name, name_now))
                _screen_status(style=name_now, play=" ".join(state.playlist))
            if state.solid:
                _pixels(state.rgb)
            elif step:
                lit = not lit
                _pixels(state.rgb if lit else (0, 0, 0))
                print(on if lit else off)
            if step:
                state.advance()

        if time.ticks_diff(time.ticks_ms(), last_hb) >= HEARTBEAT_MS:
            seq += 1
            last_hb = time.ticks_ms()
            line = "DATA %s %d" % (name, seq)
            _screen_status(seq=seq)
            if _cfg is None:
                print(line)
            elif not link.send(line):
                print("\x1b[2;%dm[%s OFFLINE]\x1b[0m" % (ansi, name))

        time.sleep_ms(TICK_MS)

        for line in link.lines():
            print("%s %s" % (rx_fmt, line))
            _screen_log(line)
            replies = state.apply(line)
            if replies is not None:
                print("  -> style=%s r=%d g=%d b=%d period=%dms %s"
                      % (state.active, state.rgb[0], state.rgb[1], state.rgb[2],
                         state.period_ms, "solid" if state.solid else "blink"))
                _screen_status(style=state.current_name(),
                               pattern="solid" if state.solid else "blink",
                               period=state.period_ms,
                               play=" ".join(state.playlist),
                               mix=" ".join(state.mixlist))
                for reply in replies:
                    if _cfg is None:
                        print(reply)
                    else:
                        link.send(reply)
            elif _keys is not None and line.upper().startswith("KEY "):
                key = line.split(" ", 1)[1].strip().upper()
                if key in KEY_NAMES:
                    press(key)
            _pixels(WHITE)
            time.sleep_ms(150)
