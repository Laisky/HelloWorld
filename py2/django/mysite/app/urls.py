#! /usr/bin/env python
# -*- coding: utf-8

from django.conf.urls import patterns, url


urlpatterns = patterns(
    'app.views',
    url(r'^template$', 'template_demo', name='template'),
    url(r'^login$', 'login', name='login'),
)
