#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import absolute_import, unicode_literals

from django.db import models


class Demo(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=50)

    class Meta:
        ordering = ["name"]
