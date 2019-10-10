"""
test_demo.py
"""

from unittest import TestCase
from typing import List

def demo(l: List[int]) -> int:
    return l[0]

class DemoTestCase(TestCase):

    def setUp(self):
        print("first run")

    def tearDown(self):
        print("last run")

    def test_demo(self):
        data = []
        self.assertRaises(IndexError, demo, data)
