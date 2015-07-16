#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.conf.urls import url, patterns, include

from .views import DetailView, ListView, UserDetail, UserList, api_root


urlpatterns = patterns(
    '',
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^$', api_root, name='root'),
    url(r'^models/(?P<pk>[0-9]+)/$', DetailView.as_view(), name='model-detail'),
    url(r'^models/$', ListView.as_view(), name='model-list'),
    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='user-detail'),
)
