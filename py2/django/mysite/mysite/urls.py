#! /usr/bin/env python
# -*- coding: utf-8

from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls), name='admin'),
)

urlpatterns += patterns(
    'mysite.views',
    url(r'^time/plus/(\d{1,2})$', 'current_datetime', name='datetime'),
)

urlpatterns += patterns('', url(r'^app/', include('app.urls', namespace='app')))
urlpatterns += patterns('', url(r'^rest/', include('rest.urls', namespace='rest')))
urlpatterns += patterns('', url(r'^user/', include('user.urls', namespace='user')))
urlpatterns += patterns('', url(r'^nosql/', include('nosql.urls', namespace='nosql')))
