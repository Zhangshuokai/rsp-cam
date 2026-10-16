"""ST7735S 160x128 landscape display + status UI for the XRS pad.

Parameters follow the XRS development manual:
- SPI2 (VSPI) mode 0 @ 20 MHz: MOSI 23, SCK 18; CS 5, DC 4.  HSPI must not be
  used on the ESP32-WROVER-B (it shares the PSRAM bus).
- LCD RST is shared with the SD-card MISO on GPIO19: pulsed here, then released.
- MADCTL = 0x60 (MV|MX) gives the 160x128 landscape layout and COLMOD = 0x05
  selects RGB565.  The panel wants big-endian pixels, so colours are stored
  pre-swapped in the framebuffer and go out in the right byte order.

The LCD acts as the pad's "LED": every colour/pattern/PLAY/MIX command the
firmware already understands is drawn as a virtual LED, next to a link/heartbeat
header, the active style details and the last received lines.
"""

import struct
import time

import framebuf
from machine import Pin, SPI

WIDTH = 160
HEIGHT = 128
SPI_BAUD = 20_000_000


def _color(rgb):
    """RGB888 -> RGB565, byte-swapped for the panel (big-endian)."""
    r, g, b = rgb
    value = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)
    return ((value & 0xFF) << 8) | (value >> 8)


BG = _color((10, 16, 24))
BAR = _color((30, 40, 58))
FG = _color((225, 232, 240))
DIM = _color((110, 124, 142))
ACCENT = _color((255, 190, 0))
OK = _color((60, 210, 110))
ERR = _color((235, 80, 80))
OFF = _color((32, 32, 32))


class XrsDisplay:
    """Low-level panel driver plus the pad's status screen."""

    def __init__(self):
        rst = Pin(19, Pin.OUT, value=1)
        time.sleep_ms(20)
        rst.value(0)
        time.sleep_ms(50)
        rst.value(1)
        time.sleep_ms(120)
        rst.init(Pin.IN)

        self.spi = SPI(
            2, baudrate=SPI_BAUD, polarity=0, phase=0, sck=Pin(18), mosi=Pin(23)
        )
        self.cs = Pin(5, Pin.OUT, value=1)
        self.dc = Pin(4, Pin.OUT, value=1)
        self._init_panel()

        self.buf = bytearray(WIDTH * HEIGHT * 2)
        self.fb = framebuf.FrameBuffer(self.buf, WIDTH, HEIGHT, framebuf.RGB565)
        self.view = memoryview(self.buf)
        self.row = bytearray(WIDTH * 2)
        self.row_view = memoryview(self.row)

        self.link = False
        self.seq = 0
        self.style = "default"
        self.pattern = "blink"
        self.period = 500
        self.play = ""
        self.mix = ""
        self.peers = {}
        self.logs = []
        self.target = (0, 0, 0)
        self.shown = self.target
        self.led_ms = 0
        self.render()

    def _cmd(self, cmd, data=None):
        self.cs(0)
        self.dc(0)
        self.spi.write(bytes([cmd]))
        if data:
            self.dc(1)
            self.spi.write(data)
        self.cs(1)

    def _init_panel(self):
        self._cmd(0x01)  # SWRESET
        time.sleep_ms(150)
        self._cmd(0x11)  # SLPOUT
        time.sleep_ms(120)
        self._cmd(0xB1, b"\x01\x2C\x2D")  # FRMCTR1 ~60 Hz
        self._cmd(0xB2, b"\x01\x2C\x2D")  # FRMCTR2
        self._cmd(0xB3, b"\x01\x2C\x2D\x01\x2C\x2D")  # FRMCTR3
        self._cmd(0xB4, b"\x07")  # INVCTR: dot inversion
        self._cmd(0xC0, b"\xA2\x02\x84")  # PWCTR1
        self._cmd(0xC1, b"\xC5")  # PWCTR2
        self._cmd(0xC2, b"\x0A\x00")  # PWCTR3
        self._cmd(0xC3, b"\x8A\x2A")  # PWCTR4
        self._cmd(0xC4, b"\x8A\xEE")  # PWCTR5
        self._cmd(0xC5, b"\x0E")  # VMCTR1
        self._cmd(0xE0, b"\x0F\x1A\x0F\x18\x2F\x28\x20\x22\x1F\x1B\x23\x37\x00\x07\x02\x10")
        self._cmd(0xE1, b"\x0F\x1B\x0F\x17\x33\x2C\x29\x2E\x30\x30\x39\x3F\x00\x07\x03\x10")
        self._cmd(0x13)  # NORON
        time.sleep_ms(10)
        self._cmd(0x36, b"\x60")  # MADCTL: MV|MX -> landscape
        self._cmd(0x3A, b"\x05")  # COLMOD: RGB565
        self._cmd(0x29)  # DISPON
        time.sleep_ms(100)

    def _blit(self, x, y, w, h):
        self.cs(0)
        self.dc(0)
        self.spi.write(b"\x2A")  # CASET
        self.dc(1)
        self.spi.write(struct.pack(">HH", x, x + w - 1))
        self.dc(0)
        self.spi.write(b"\x2B")  # RASET
        self.dc(1)
        self.spi.write(struct.pack(">HH", y, y + h - 1))
        self.dc(0)
        self.spi.write(b"\x2C")  # RAMWR
        self.dc(1)
        row = self.row
        row_view = self.row_view
        view = self.view
        offset = y * WIDTH * 2 + x * 2
        stride = WIDTH * 2
        span = w * 2
        for _ in range(h):
            row[:span] = view[offset : offset + span]
            self.spi.write(row_view[:span])
            offset += stride
        self.cs(1)

    def _draw_led(self):
        self.fb.fill_rect(6, 18, 58, 58, BAR)
        self.fb.rect(6, 18, 58, 58, DIM)
        inner = OFF if self.target == (0, 0, 0) else _color(self.target)
        self.fb.fill_rect(9, 21, 52, 52, inner)

    def render(self):
        fb = self.fb
        fb.fill(BG)
        fb.fill_rect(0, 0, WIDTH, 12, BAR)
        fb.text("XRS", 2, 2, ACCENT)
        fb.text("LINK" if self.link else "----", 34, 2, OK if self.link else ERR)
        hb = "HB %d" % self.seq
        fb.text(hb, WIDTH - 2 - 8 * len(hb), 2, FG)
        fb.hline(0, 12, WIDTH, DIM)
        self._draw_led()
        fb.text("style:" + self.style[:10], 70, 16, FG)
        fb.text("%s %dms" % (self.pattern[:5], self.period), 70, 26, DIM)
        mode = "-"
        if self.mix:
            mode = "MIX " + self.mix
        elif self.play:
            mode = "PLAY " + self.play
        fb.text(mode[:11], 70, 38, ACCENT)
        peers = " ".join("%s%d" % (n[0], s) for n, s in sorted(self.peers.items()))
        fb.text(peers[:11], 70, 50, DIM)
        fb.hline(0, 76, WIDTH, DIM)
        y = 78
        for line in self.logs[-6:]:
            fb.text(line[:19], 2, y, FG)
            y += 8
        self._blit(0, 0, WIDTH, HEIGHT)
        self.shown = self.target

    def led(self, rgb):
        if rgb != self.target:
            self.target = rgb
        if self.target == self.shown:
            return
        now = time.ticks_ms()
        if time.ticks_diff(now, self.led_ms) < 50:
            return
        self.led_ms = now
        self._draw_led()
        self._blit(6, 18, 58, 58)
        self.shown = self.target

    def log(self, text):
        text = str(text).strip()
        if text.startswith("FROM "):
            parts = text.split()
            if len(parts) == 3:
                try:
                    self.peers[parts[1]] = int(parts[2])
                except ValueError:
                    pass
        self.logs.append(text[:19])
        if len(self.logs) > 6:
            self.logs.pop(0)
        self.render()

    def status(self, **kw):
        for key in ("link", "seq", "style", "pattern", "period", "play", "mix"):
            if key in kw:
                setattr(self, key, kw[key])
        self.render()
