#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import
import json
import logging

from django.conf import settings
from rest_framework import serializers


log = logging.getLogger(settings.LOG_NAME)


class MyCustField(serializers.CharField):

    def to_representation(self, obj):
        """To Disaply"""
        log.info('to_representation for obj {}'.format(obj))
        return obj

    def to_internal_value(self, data):
        """To PyObj"""
        log.info('to_internal_value for data {}'.format(data))
        return json.loads(data.encode('utf-8'))
