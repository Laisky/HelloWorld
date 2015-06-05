#! /usr/bin/env python
# -*- coding: utf-8

from django.conf.urls import patterns, url

from .views import Register, Login


urlpatterns = patterns(
    '',
    url(r'^register/$', Register.as_view(), name='register'),
    url(r'^login/$', Login.as_view(), name='login'),
)
