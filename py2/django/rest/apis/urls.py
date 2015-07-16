#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.conf.urls import url, patterns, include
from rest_framework.routers import DefaultRouter

from . import views


user_detail = views.UserViewSet.as_view({'get': 'retrieve'})
user_list = views.UserViewSet.as_view({'get': 'list', 'post': 'create'})

modal_plain = views.ModelViewSet.as_view({'get': 'plaintext'})
model_detail = views.ModelViewSet.as_view({'get': 'retrieve', 'post': 'create'})
model_list = views.ModelViewSet.as_view({'get': 'list', 'post': 'create'})

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'models', views.ModelViewSet)
router.register(r'users', views.UserViewSet)


urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^models/(?P<pk>[0-9]+)/$', model_detail, name='model-detail'),
    url(r'^models/(?P<pk>[0-9]+)/plain/$', modal_plain, name='model-plain'),
    url(r'^models/$', model_list, name='model-list'),
    url(r'^users/$', user_list, name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user-detail'),
)
