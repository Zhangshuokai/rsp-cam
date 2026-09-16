import sys
import paramiko

HOST = "172.26.188.115"
USER = "nczydx"
PASS = "123456789"


def main():
    args = sys.argv[1:]
    sudo = False
    if args and args[0] == "--sudo":
        sudo = True
        args = args[1:]
    if args and args[0] == "--host":
        globals()["HOST"] = args[1]
        args = args[2:]
    if args and args[0] == "--file":
        local = args[1]
        with open(local, "rb") as fh:
            payload = fh.read()
        cli = paramiko.SSHClient()
        cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        cli.connect(HOST, port=22, username=USER, password=PASS, timeout=15,
                    look_for_keys=False, allow_agent=False)
        sftp = cli.open_sftp()
        remote = "/tmp/kilo-run.sh"
        with sftp.open(remote, "wb") as fh:
            fh.write(payload)
        sftp.close()
        cmd = ("sudo -S -p '' bash " if sudo else "bash ") + remote
        stdin, stdout, stderr = cli.exec_command(cmd, timeout=300)
        if sudo:
            stdin.write(PASS + "\n")
            stdin.flush()
        out = stdout.read().decode("utf-8", "replace")
        err = stderr.read().decode("utf-8", "replace")
        rc = stdout.channel.recv_exit_status()
        sys.stdout.write(out)
        if err.strip():
            sys.stdout.write("--- stderr ---\n" + err)
        sys.stdout.write("--- exit %d ---\n" % rc)
        cli.close()
        return
    cmd = " ".join(args)
    if sudo:
        cmd = "sudo -S -p '' bash -lc " + "'" + cmd.replace("'", "'\\''") + "'"
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(HOST, port=22, username=USER, password=PASS, timeout=15,
                look_for_keys=False, allow_agent=False)
    stdin, stdout, stderr = cli.exec_command(cmd, timeout=300)
    if sudo:
        stdin.write(PASS + "\n")
        stdin.flush()
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    rc = stdout.channel.recv_exit_status()
    sys.stdout.write(out)
    if err.strip():
        sys.stdout.write("--- stderr ---\n" + err)
    sys.stdout.write("--- exit %d ---\n" % rc)
    cli.close()


main()
