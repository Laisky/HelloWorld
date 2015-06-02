#! /usr/bin/env python
# -*- coding: utf-8

import datetime

from django.http import HttpResponse


def current_datetime(request, offset):
    now = datetime.datetime.now()
    html = "<html><body>It is now {}.{}</body></html>".format(now, offset)
    return HttpResponse(html)
