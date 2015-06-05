#! /usr/bin/env python
# -*- coding: utf-8

from django.conf.urls import patterns, url

from .views import Registry


urlpatterns = patterns(
    '',
    url(r'^register$', Registry.as_view(), name='register'),
)
