"""Forward a LAN TCP port to the WSL-hosted ROS 2 wifi_server.

WSL mirrored networking blocks inbound connections from the LAN (Hyper-V
firewall), so the boards connect to this Windows-side forwarder, which relays
each connection to the wifi_server running inside WSL (reachable from Windows
via localhost). No COM port is involved.

Usage:
    python tools/tcp_forwarder.py --listen 0.0.0.0:6000 --target 127.0.0.1:6001
"""

import argparse
import socket
import threading


def pipe(src, dst):
    try:
        while True:
            data = src.recv(4096)
            if not data:
                break
            dst.sendall(data)
    except OSError:
        pass
    finally:
        for sock in (src, dst):
            try:
                sock.shutdown(socket.SHUT_RDWR)
            except OSError:
                pass


def handle(conn, target):
    try:
        upstream = socket.create_connection(target, 5)
    except OSError as exc:
        print("cannot reach %s:%d: %s" % (target[0], target[1], exc), flush=True)
        conn.close()
        return
    threading.Thread(target=pipe, args=(conn, upstream), daemon=True).start()
    pipe(upstream, conn)
    conn.close()
    upstream.close()


def parse_endpoint(text):
    host, port = text.rsplit(":", 1)
    return (host, int(port))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--listen", default="0.0.0.0:6000")
    parser.add_argument("--target", default="127.0.0.1:6001")
    args = parser.parse_args()

    listen = parse_endpoint(args.listen)
    target = parse_endpoint(args.target)

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(listen)
    server.listen(5)
    print(
        "forwarding %s:%d -> %s:%d" % (listen[0], listen[1], target[0], target[1]),
        flush=True,
    )
    while True:
        conn, addr = server.accept()
        print("board connection from %s" % (addr,), flush=True)
        threading.Thread(target=handle, args=(conn, target), daemon=True).start()


if __name__ == "__main__":
    main()
