#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.db import models


class MyModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    field = models.CharField(max_length=100)
