"""Bridge a Windows COM port to a TCP socket so WSL can use it.

WSL2 cannot open COM ports directly and usbipd needs admin rights, so this
small server exposes each board as ``tcp://127.0.0.1:<port>``. The WSL ROS 2
nodes connect with pyserial URLs like ``socket://localhost:50013``.

Usage (one per board):
    python tools/serial_tcp_bridge.py --port COM13 --tcp 50013
    python tools/serial_tcp_bridge.py --port COM14 --tcp 50014
"""

import argparse
import socket
import threading

import serial


def pump(conn, ser):
    stop = threading.Event()

    def serial_to_socket():
        while not stop.is_set():
            try:
                data = ser.read(1024)
            except Exception as exc:
                print("serial read error:", exc, flush=True)
                break
            if data:
                try:
                    conn.sendall(data)
                except OSError:
                    break
        stop.set()

    def socket_to_serial():
        while not stop.is_set():
            try:
                data = conn.recv(1024)
            except OSError:
                break
            if not data:
                break
            try:
                ser.write(data)
            except Exception as exc:
                print("serial write error:", exc, flush=True)
                break
        stop.set()

    threads = [
        threading.Thread(target=serial_to_socket, daemon=True),
        threading.Thread(target=socket_to_serial, daemon=True),
    ]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", required=True, help="Windows COM port, e.g. COM13")
    parser.add_argument("--tcp", required=True, type=int, help="TCP port to listen on")
    parser.add_argument("--baud", type=int, default=115200)
    args = parser.parse_args()

    ser = serial.Serial(args.port, args.baud, timeout=0.2)
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("127.0.0.1", args.tcp))
    server.listen(1)
    print("bridge %s <-> tcp://127.0.0.1:%d" % (args.port, args.tcp), flush=True)
    while True:
        conn, addr = server.accept()
        print("client connected", addr, flush=True)
        pump(conn, ser)
        conn.close()
        print("client disconnected", flush=True)


if __name__ == "__main__":
    main()
