#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.db import models
from django.contrib.auth.models import User

from .fields import SerializedField


class MyModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, related_name='mymodels')
    field = models.CharField(max_length=100)
    options = SerializedField(max_length=1000, default={})
