#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals
import json

from django.db import models


class SerializedField(models.TextField):

    """序列化域
    用 pickle 来实现存储 Python 对象
    """
    __metaclass__ = models.SubfieldBase  # 必须指定该 metaclass 才能使用 to_python

    def validate(self, val):
        raise isinstance(val, basestring)

    def to_python(self, val):
        if val and isinstance(val, unicode):
            return json.loads(val.encode('utf-8'))

        return val

    def get_prep_value(self, val):
        return json.dumps(val)
