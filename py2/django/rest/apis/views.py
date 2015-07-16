#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import User
from rest_framework import generics, permissions

from .serializers import MySerializer, UserSerializer
from .models import MyModel


class DetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    queryset = MyModel.objects.all()
    serializer_class = MySerializer


class ListView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    queryset = MyModel.objects.all()
    serializer_class = MySerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
