"""Run on the local machine: receive frames from cam_server.py and display them.

Reconnects automatically when the stream drops. Press q or Esc to quit.
"""
import argparse
import socket
import struct
import time

import cv2
import numpy as np

WINDOW = "Raspberry Pi camera"
MAX_FRAME = 8 << 20
IDLE_TIMEOUT = 10


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
    while True:
        result = recv_frame(sock)
        if result is None:
            return True
        frame = result[0]
        if frame is None:
            continue
        frames += 1
        cv2.putText(
            frame,
            "%.1f fps" % (frames / (time.time() - started)),
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2,
        )
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
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="172.26.188.115")
    ap.add_argument("--port", type=int, default=5000)
    ap.add_argument("--frames", type=int, default=0, help="stop after N frames, 0 = forever")
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
