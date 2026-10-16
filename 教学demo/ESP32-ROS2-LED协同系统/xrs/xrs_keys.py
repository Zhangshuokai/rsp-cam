"""Six-key input for the XRS pad (active-low, IRQ + debounce).

Pins per the XRS manual: UP 2, DOWN 13, LEFT 27, RIGHT 35, A 34, B 12.
GPIO34/35 are input-only with no internal pull-up, the others use the built-in
pull-up.  The handlers only record debounced edges; the main loop drains
``events()``.
"""

import time

from machine import Pin

KEY_PINS = (
    ("UP", 2),
    ("DOWN", 13),
    ("LEFT", 27),
    ("RIGHT", 35),
    ("A", 34),
    ("B", 12),
)
DEBOUNCE_MS = 60


class XrsKeys:
    """Fall-edge events for the pad's six buttons."""

    def __init__(self):
        self.queue = []
        self.last = {}
        for name, gpio in KEY_PINS:
            if gpio in (34, 35, 36, 39):
                pin = Pin(gpio, Pin.IN)
            else:
                pin = Pin(gpio, Pin.IN, Pin.PULL_UP)
            pin.irq(trigger=Pin.IRQ_FALLING, handler=self._handler(name))

    def _handler(self, name):
        def handler(pin):
            now = time.ticks_ms()
            previous = self.last.get(name)
            if previous is not None and time.ticks_diff(now, previous) < DEBOUNCE_MS:
                return
            self.last[name] = now
            if len(self.queue) < 8:
                self.queue.append(name)
        return handler

    def events(self):
        events = self.queue
        self.queue = []
        return events
