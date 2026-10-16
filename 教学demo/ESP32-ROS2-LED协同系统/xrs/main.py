from board_common import blink

try:
    from xrs_display import XrsDisplay

    display = XrsDisplay()
except Exception as exc:
    print("xrs display init failed: %s" % exc)
    display = None

try:
    from xrs_keys import XrsKeys

    keys = XrsKeys()
except Exception as exc:
    print("xrs keys init failed: %s" % exc)
    keys = None

blink((255, 170, 0), "XRS", 33, display=display, keys=keys)
