#! /usr/bin/env python
# -*- coding: utf-8

from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns(
    'app.views',
    url(r'^template$', views.template_demo, name='template'),
    url(r'^login$', views.login, name='login'),
)
