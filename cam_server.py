"""Run on the Raspberry Pi: grab frames with OpenCV and push them over TCP.

Frame wire format: 4-byte big-endian length + JPEG payload.
"""
import argparse
import socket
import struct
import time

import cv2


def open_camera(args):
    cap = cv2.VideoCapture(args.device, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)
    cap.set(cv2.CAP_PROP_FPS, args.fps)
    if not cap.isOpened():
        return None
    return cap


def serve(conn, cap, args):
    frames = 0
    misses = 0
    started = time.time()
    while True:
        ok, frame = cap.read()
        if not ok:
            misses += 1
            if misses >= 20:
                return False
            time.sleep(0.05)
            continue
        misses = 0
        ok, buf = cv2.imencode(
            ".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), args.quality]
        )
        if not ok:
            continue
        data = buf.tobytes()
        conn.sendall(struct.pack(">I", len(data)) + data)
        frames += 1
        if frames % 60 == 0:
            print(
                "sent %d frames, %.1f fps" % (frames, frames / (time.time() - started)),
                flush=True,
            )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--device", type=int, default=0)
    ap.add_argument("--width", type=int, default=640)
    ap.add_argument("--height", type=int, default=480)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--quality", type=int, default=70)
    ap.add_argument("--port", type=int, default=5000)
    ap.add_argument("--bind", default="172.26.188.115", help="address to listen on")
    args = ap.parse_args()

    cap = open_camera(args)
    if cap is None:
        raise SystemExit("cannot open camera %d" % args.device)
    print(
        "camera %d: %dx%d fps=%.0f"
        % (
            args.device,
            cap.get(cv2.CAP_PROP_FRAME_WIDTH),
            cap.get(cv2.CAP_PROP_FRAME_HEIGHT),
            cap.get(cv2.CAP_PROP_FPS),
        ),
        flush=True,
    )

    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind((args.bind, args.port))
    srv.listen(1)
    print("listening on %s:%d" % (args.bind, args.port), flush=True)

    while True:
        conn, addr = srv.accept()
        conn.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        print("client connected: %s:%d" % addr, flush=True)
        try:
            alive = serve(conn, cap, args)
        except (BrokenPipeError, ConnectionResetError, OSError) as exc:
            print("client gone: %s" % exc, flush=True)
            alive = True
        finally:
            conn.close()
        if not alive:
            print("camera read failed, reopening", flush=True)
            cap.release()
            cap = open_camera(args)
            if cap is None:
                raise SystemExit("camera lost")


if __name__ == "__main__":
    main()
