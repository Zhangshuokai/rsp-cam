"""Run on the local machine: receive frames from cam_server.py and display them.

Reconnects automatically when the stream drops. Press q or Esc to quit.
"""
import argparse
import socket
import struct
import sys
import time

import cv2
import numpy as np

WINDOW = "Raspberry Pi camera"
MAX_FRAME = 8 << 20
IDLE_TIMEOUT = 10


def enable_dpi_awareness():
    """Keep the window pixel-exact on HiDPI screens (Windows bitmap-scales unaware apps)."""
    if sys.platform != "win32":
        return
    try:
        import ctypes

        ctypes.windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def recv_exact(sock, size):
    chunks = []
    while size > 0:
        chunk = sock.recv(size)
        if not chunk:
            return None
        chunks.append(chunk)
        size -= len(chunk)
    return b"".join(chunks)


def recv_frame(sock):
    header = recv_exact(sock, 4)
    if header is None:
        return None
    size = struct.unpack(">I", header)[0]
    if size == 0 or size > MAX_FRAME:
        print("bad frame length %d, dropping connection" % size, flush=True)
        return None
    data = recv_exact(sock, size)
    if data is None:
        return None
    frame = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    return frame, size


def display(sock, args):
    frames = 0
    started = time.time()
    window_ready = False
    while True:
        result = recv_frame(sock)
        if result is None:
            return True
        frame = result[0]
        if frame is None:
            continue
        if args.scale != 1.0:
            frame = cv2.resize(
                frame, None, fx=args.scale, fy=args.scale, interpolation=cv2.INTER_CUBIC
            )
        if not window_ready:
            cv2.namedWindow(WINDOW, cv2.WINDOW_AUTOSIZE)
            window_ready = True
        frames += 1
        label = "%.1f fps" % (frames / (time.time() - started))
        scale = max(0.6, frame.shape[1] / 1600.0)
        thickness = max(1, int(round(scale * 2)))
        org = (10, int(round(30 * scale)))
        cv2.putText(frame, label, org, cv2.FONT_HERSHEY_SIMPLEX, scale, (0, 0, 0), thickness + 2)
        cv2.putText(frame, label, org, cv2.FONT_HERSHEY_SIMPLEX, scale, (0, 255, 0), thickness)
        cv2.imshow(WINDOW, frame)
        if cv2.waitKey(1) & 0xFF in (27, ord("q")):
            return False
        if cv2.getWindowProperty(WINDOW, cv2.WND_PROP_VISIBLE) < 1:
            return False
        if args.frames and frames >= args.frames:
            return False


def check(sock, args):
    frames = 0
    started = time.time()
    while True:
        result = recv_frame(sock)
        if result is None:
            print("stream ended after %d frames" % frames, flush=True)
            return
        frame, size = result
        if frame is None:
            continue
        frames += 1
        if frames == 1:
            print(
                "first frame: %dx%d, %d bytes" % (frame.shape[1], frame.shape[0], size),
                flush=True,
            )
        if args.frames and frames >= args.frames:
            print(
                "%d frames in %.2fs (%.1f fps)"
                % (frames, time.time() - started, frames / (time.time() - started)),
                flush=True,
            )
            return


def main():
    enable_dpi_awareness()
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="172.26.188.116")
    ap.add_argument("--port", type=int, default=5000)
    ap.add_argument("--frames", type=int, default=0, help="stop after N frames, 0 = forever")
    ap.add_argument("--scale", type=float, default=1.0, help="display zoom factor, 1.0 = pixel-exact")
    ap.add_argument("--check", action="store_true", help="no window, just verify the stream")
    args = ap.parse_args()

    try:
        while True:
            try:
                sock = socket.create_connection((args.host, args.port), timeout=IDLE_TIMEOUT)
            except OSError as exc:
                print("connect to %s:%d failed: %s" % (args.host, args.port, exc), flush=True)
                if args.check:
                    return
                time.sleep(2)
                continue

            print("connected to %s:%d" % (args.host, args.port), flush=True)
            sock.settimeout(IDLE_TIMEOUT)
            try:
                if args.check:
                    check(sock, args)
                    return
                if not display(sock, args):
                    return
            except OSError as exc:
                print("stream interrupted: %s" % exc, flush=True)
            finally:
                sock.close()

            print("reconnecting...", flush=True)
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        if not args.check:
            cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
