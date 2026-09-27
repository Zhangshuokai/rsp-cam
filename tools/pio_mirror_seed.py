"""并行预下载 PlatformIO 包，绕开国内拉取慢的问题。

背景：PlatformIO registry 的下载会 302 到境外对象存储（实测 usc1.contabostorage.com），
单连接只有 ~50 KB/s；但该存储支持 HTTP Range，多连接可聚合到数 MB/s。
本脚本按 PlatformIO 自己的缓存命名规则把文件直接放进 ~/.platformio/.cache/downloads/，
之后 `pio run` / `pio pkg install` 会直接命中缓存，不再重新下载。

用法：
    python tools/pio_mirror_seed.py <owner>/<type>/<name> <版本或约束> [连接数]

示例：
    # Windows 上的 ESP32-S3 工程依赖
    python tools/pio_mirror_seed.py espressif/tool/toolchain-riscv32-esp 8.4.0+2021r2-patch5 24
    python tools/pio_mirror_seed.py platformio/tool/framework-arduinoespressif32 "~4.20017.0" 24

    # WSL（Linux）上的同类依赖，先指定目标平台
    $env:PIO_SEED_SYSTEM="linux_x86_64"; python tools/pio_mirror_seed.py espressif/tool/toolchain-xtensa-esp32s3 8.4.0+2021r2-patch5 24

环境变量：
    PIO_SEED_PROXY   代理地址，默认 http://127.0.0.1:7897（本机 Clash 混合端口）
    PIO_SEED_SYSTEM  目标平台，默认 windows_amd64（WSL 用 linux_x86_64）

缓存键 = sha1(镜像 Location + "X-PIO-Content-SHA256")，与
platformio/package/manager/_download.py::compute_download_path 一致；下载完做 sha256 校验。
"""
import concurrent.futures
import hashlib
import json
import os
import sys
import urllib.error
import urllib.request

PROXY = os.environ.get("PIO_SEED_PROXY", "http://127.0.0.1:7897")
CACHE = os.path.join(os.path.expanduser("~"), ".platformio", ".cache", "downloads")
SYSTEM = os.environ.get("PIO_SEED_SYSTEM", "windows_amd64")


def opener(use_proxy=True):
    if use_proxy:
        ph = urllib.request.ProxyHandler({"http": PROXY, "https": PROXY})
    else:
        ph = urllib.request.ProxyHandler({})
    return urllib.request.build_opener(ph)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def head(url):
    op = urllib.request.build_opener(
        urllib.request.ProxyHandler({"http": PROXY, "https": PROXY}), NoRedirect()
    )
    req = urllib.request.Request(url, method="HEAD")
    try:
        r = op.open(req, timeout=60)
        return r.status, dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers)


def get_json(url):
    with opener().open(url, timeout=60) as r:
        return json.load(r)


def pick_version(versions, want):
    names = [v["name"] for v in versions]
    if want in names:
        return want
    if want.startswith("~"):
        prefix = ".".join(want[1:].split(".")[:-1]) + "."
        cands = [n for n in names if n.startswith(prefix)]
        if cands:
            return max(cands, key=lambda s: [int(x) for x in s.split(".") if x.isdigit()])
    if want.startswith("^"):
        major = want[1:].split(".")[0]
        cands = [n for n in names if n.split(".")[0] == major]
        if cands:
            return max(cands)
    raise SystemExit("no version matching %s among %s" % (want, names))


def download_parallel(url, dest, size, threads):
    part = dest + ".part"
    with open(part, "wb") as f:
        f.truncate(size)
    chunk = size // threads + 1
    ranges = []
    for i in range(threads):
        a = i * chunk
        if a >= size:
            break
        ranges.append((a, min(a + chunk - 1, size - 1)))

    def worker(a, b):
        pos = a
        tries = 0
        while pos <= b and tries < 20:
            tries += 1
            req = urllib.request.Request(url, headers={"Range": "bytes=%d-%d" % (pos, b)})
            with opener().open(req, timeout=180) as r, open(part, "r+b") as f:
                f.seek(pos)
                while True:
                    data = r.read(1 << 20)
                    if not data:
                        break
                    f.write(data)
                    pos += len(data)
        return pos - a

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(ranges)) as ex:
        futs = [ex.submit(worker, a, b) for a, b in ranges]
        total = 0
        for fu in concurrent.futures.as_completed(futs):
            total += fu.result()
    if total != size:
        raise SystemExit("short download: %d/%d" % (total, size))
    os.replace(part, dest)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for blk in iter(lambda: f.read(1 << 20), b""):
            h.update(blk)
    return h.hexdigest()


def matches_system(f):
    s = f.get("system")
    if not s:
        return True
    if isinstance(s, str):
        return s == "*" or s == SYSTEM
    return SYSTEM in s or "*" in s


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    spec, want = sys.argv[1], sys.argv[2]
    threads = int(sys.argv[3]) if len(sys.argv) > 3 else 16
    owner, ptype, name = spec.split("/")
    data = get_json(
        "https://api.registry.platformio.org/v3/packages/%s/%s/%s" % (owner, ptype, name)
    )
    ver = pick_version(data["versions"], want)
    entry = next(v for v in data["versions"] if v["name"] == ver)
    fobj = next(f for f in entry["files"] if matches_system(f))
    dl = fobj["download_url"]
    print("resolved %s @ %s -> %s (%.1f MB)" % (name, ver, fobj["name"], fobj["size"] / 1e6))

    status, h = head(dl)
    loc = h.get("Location") or h.get("location")
    csum = h.get("X-PIO-Content-SHA256") or h.get("x-pio-content-sha256")
    if not loc or not csum:
        raise SystemExit("HEAD did not return mirror Location/checksum: %s %s" % (status, h))
    key = hashlib.sha1((loc + csum).encode()).hexdigest()
    target = os.path.join(CACHE, key)
    print("cache key %s" % key)
    if os.path.isfile(target) and os.path.getsize(target) == fobj["size"]:
        print("already cached: %s" % target)
        return
    os.makedirs(CACHE, exist_ok=True)
    print("downloading via %s with %d connections" % (loc.split("/")[2], threads))
    download_parallel(loc, target, fobj["size"], threads)
    got = sha256_file(target)
    if got.lower() != csum.lower():
        os.remove(target)
        raise SystemExit("checksum mismatch: %s != %s" % (got, csum))
    print("OK -> %s (%.1f MB, sha256 verified)" % (target, os.path.getsize(target) / 1e6))


if __name__ == "__main__":
    main()
