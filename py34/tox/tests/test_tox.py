#! /usr/bin/env python
# -*- coding: utf-8

from unittest import TestCase

import tox_test


class TestDemo(TestCase):

    def test_func_a(self):
        r = tox_test.func_a(10)
        expect = 10
        self.assertEqual(r, expect)

    def test_func_b(self):
        r = tox_test.func_b(10)
        expect = 20
        self.assertEqual(r, expect)
