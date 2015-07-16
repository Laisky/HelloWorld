#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from rest_framework import generics

from .serializers import MySerializer
from .models import MyModel


class DetailView(generics.RetrieveAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer


class ListView(generics.ListCreateAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
