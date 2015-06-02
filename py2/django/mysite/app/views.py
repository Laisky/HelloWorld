#! /usr/bin/env python
# -*- coding: utf-8

import datetime

from django.http import HttpResponse
from django.shortcuts import render_to_response


def template_demo(request):
    return render_to_response('demo.html', {'name': 'Laisky'})
