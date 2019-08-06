#! /usr/bin/env python
# -*- coding: utf-8
from django.conf.urls.defaults import patterns, url
from django.views.generic import DetailView

from .models import Posts
from .views import PostListView, OpHandler


urlpatterns = patterns(
    '',
    url(r'^post/(?P<pk>[a-z\d]+)/$', DetailView.as_view(model=Posts), name='post_detail'),
    url(r'^$', PostListView.as_view(), name='post_list'),
    url(r'^op/$', OpHandler.as_view(), name='op'),
)
