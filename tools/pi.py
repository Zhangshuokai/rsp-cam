import sys
import paramiko

HOST = "172.26.188.116"
USER = "nanzhida"
PASS = "nanzhida"


def main():
    args = list(sys.argv[1:])
    sudo = False
    local = None
    def take_value(flag):
        if not args:
            sys.stderr.write("missing value for %s\n" % flag)
            sys.exit(2)
        return args.pop(0)

    while args and args[0].startswith("--"):
        flag = args.pop(0)
        if flag == "--sudo":
            sudo = True
        elif flag == "--host":
            globals()["HOST"] = take_value(flag)
        elif flag == "--user":
            globals()["USER"] = take_value(flag)
        elif flag == "--pass":
            globals()["PASS"] = take_value(flag)
        elif flag == "--file":
            local = take_value(flag)
        else:
            sys.stderr.write("unknown option: %s\n" % flag)
            sys.exit(2)
    if local is not None:
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
