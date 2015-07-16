#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.conf.urls import url, patterns

from .views import DetailView, ListView


urlpatterns = patterns(
    '',
    url(r'^detail/(?P<pk>[0-9]+)/$', DetailView.as_view(), name='detail'),
    url(r'^list/$', ListView.as_view(), name='list'),
)
