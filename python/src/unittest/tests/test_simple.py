"""简单测试示例

安装 nose 后

`$ nosetests -vs tests`

得到
```
test_first_case (test_simple.FirstTestCase) ... ok
test_second_case (test_simple.FirstTestCase) ... FAIL

======================================================================
FAIL: test_second_case (test_simple.FirstTestCase)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/laisky/repo/HelloWorld/python/src/unittest/tests/test_simple.py", line 49, in test_second_case
    self.assertTrue(False)
nose.proxy.AssertionError: False is not true
-------------------- >> begin captured logging << --------------------
test_simple: INFO: before test case
test_simple: INFO: second case
test_simple: INFO: after test case
--------------------- >> end captured logging << ---------------------
```
"""

from unittest import TestCase
import logging

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)


class FirstTestCase(TestCase):

    def setUp(self):
        log.info('before test case')

    def tearDown(self):
        log.info('after test case')

    def test_first_case(self):
        log.info('first case')
        self.assertTrue(True)

    def test_second_case(self):
        log.info('second case')
        self.assertTrue(False)
