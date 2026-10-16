"""Upload the shared module plus one board's main.py, then reboot the board.

Usage:
    python tools/deploy.py COM13 green
    python tools/deploy.py COM14 blue
    python tools/deploy.py COM5 xrs
"""

import base64
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOARDS = ("green", "blue", "xrs")
GD32_VID = 0x28E9  # XRS pad's USB-UART bridge (mpremote cannot enter raw REPL)


def mpremote(args, attempts=2):
    """Run mpremote; its first raw-REPL entry often fails, so retry once."""
    for _ in range(attempts):
        rc = subprocess.call([sys.executable, "-m", "mpremote"] + args)
        if rc == 0:
            return 0
        time.sleep(2)
    return rc


def board_files(board):
    """(local path, remote name) pairs to upload for one board."""
    files = [
        (os.path.join(ROOT, "common", "board_common.py"), "board_common.py"),
    ]
    wifi_config = os.path.join(ROOT, "common", "wifi_config.py")
    if os.path.exists(wifi_config):
        files.append((wifi_config, "wifi_config.py"))
    if board == "xrs":
        files.append((os.path.join(ROOT, "xrs", "xrs_display.py"), "xrs_display.py"))
        files.append((os.path.join(ROOT, "xrs", "xrs_keys.py"), "xrs_keys.py"))
    files.append((os.path.join(ROOT, board, "main.py"), "main.py"))
    return files


def is_gd32_port(port):
    """True for the XRS pad's GD32 bridge (VID 28E9)."""
    try:
        import serial.tools.list_ports
    except ImportError:
        return False
    for info in serial.tools.list_ports.comports():
        if info.device.upper() == port.upper():
            return info.vid == GD32_VID
    return False


def read_until(ser, marker, timeout=8.0):
    end = time.time() + timeout
    data = b""
    while time.time() < end:
        chunk = ser.read(4096)
        if chunk:
            data += chunk
            if marker in data:
                break
    return data


def drain(ser, quiet=0.2, limit=2.0):
    """Read until the port has been quiet for ``quiet`` seconds."""
    deadline = time.time() + limit
    last = time.time()
    while time.time() < deadline:
        if ser.read(4096):
            last = time.time()
        elif time.time() - last > quiet:
            break


def enter_repl(ser, attempts=8):
    for _ in range(attempts):
        ser.write(b"\x03\x03\r")
        out = read_until(ser, b">>>", 2.0)
        if b"raw REPL" in out:
            ser.write(b"\x02\r")
            out += read_until(ser, b">>>", 2.0)
        if b">>>" in out:
            time.sleep(0.15)
            drain(ser)
            return
        time.sleep(0.5)
    raise RuntimeError("could not reach the MicroPython REPL")


def run_line(ser, line, timeout=8.0, attempts=3):
    """Send one CR-terminated line and confirm the REPL echoed it back.

    The GD32 bridge can split or drop host->board bytes (sometimes a stray CR
    cuts a line short), so a line is resent after a Ctrl-C clear until its echo
    arrives intact; callers must therefore keep their lines idempotent.
    """
    for _ in range(attempts):
        ser.write(line.encode() + b"\r")
        out = read_until(ser, b">>>", timeout)
        if b"Traceback" in out:
            if line.encode() in out:
                raise RuntimeError(
                    "remote error for %r:\n%s"
                    % (line[:60], out.decode(errors="replace")[-300:])
                )
            ser.write(b"\x03\r")
            read_until(ser, b">>>", 2.0)
            continue
        if line.encode() in out:
            return out
        ser.write(b"\x03\r")
        read_until(ser, b">>>", 2.0)
    raise RuntimeError("could not deliver line: %r" % line[:60])


def repl_upload(port, files):
    """Upload through the friendly REPL.

    The GD32 bridge buffers host->board bytes and flushes them on CR, so
    mpremote's raw-REPL handshake never syncs.  Every command is a single line
    terminated by CR and file contents travel as base64 chunks written with
    explicit seeks, so a resent chunk overwrites instead of duplicating.
    """
    import serial

    with serial.Serial(port, 115200, timeout=0.1) as ser:
        time.sleep(0.3)
        drain(ser)
        enter_repl(ser)
        run_line(ser, "import binascii as ubinascii, os")
        for local, remote in files:
            with open(local, "rb") as fh:
                data = fh.read()
            print("repl cp %s :%s" % (local, remote))
            run_line(ser, "f=open('%s','wb')" % remote)
            encoded = base64.b64encode(data).decode()
            for i in range(0, len(encoded), 512):
                run_line(
                    ser,
                    "f.seek(%d); f.write(ubinascii.a2b_base64('%s'))"
                    % (i // 4 * 3, encoded[i : i + 512]),
                )
            run_line(ser, "f.close()")
            out = run_line(ser, "print('SIZE', os.stat('%s')[6])" % remote)
            if ("SIZE %d" % len(data)).encode() not in out:
                raise RuntimeError("size check failed for %s" % remote)
        ser.write(b"import machine; machine.reset()\r")
        time.sleep(0.5)


def main():
    if len(sys.argv) != 3 or sys.argv[2] not in BOARDS:
        print("usage: python tools/deploy.py <COMx> <%s>" % "|".join(BOARDS))
        return 2

    port, board = sys.argv[1], sys.argv[2]
    files = board_files(board)
    if is_gd32_port(port):
        repl_upload(port, files)
        return 0

    upload = ["connect", port, "cp", files[0][0], ":" + files[0][1]]
    for local, remote in files[1:]:
        upload += ["+", "cp", local, ":" + remote]
    rc = mpremote(upload)
    if rc != 0:
        return rc
    # Separate connection: resetting at the end of a raw-REPL session can leave
    # the board idle in the REPL instead of booting main.py.
    return mpremote(["connect", port, "reset"])


if __name__ == "__main__":
    sys.exit(main())
