"""
Run:
::

    pytest tests.py
"""

import unittest

from hypothesis import given, example, assume
from hypothesis.strategies import integers

from source import custom_add


class DemoAddTestCase(unittest.TestCase):

    @given(a=integers(), b=integers())
    @example(a=1, b=2)
    def test_decode_inverts_encode(self, a, b):
        assume(a > 0)
        self.assertEqual(custom_add(a, b) - b, a)
        self.assertEqual(custom_add(a, b) - a, b)
