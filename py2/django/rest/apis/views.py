#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import User
from rest_framework import permissions, viewsets, renderers
from rest_framework.decorators import (
    permission_classes, detail_route
)
from rest_framework.response import Response

from .serializers import MySerializer, UserSerializer
from .models import MyModel


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ModelViewSet(viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    @detail_route(renderer_classes=[renderers.StaticHTMLRenderer])
    def plaintext(self, request, *args, **kwargs):
        model = self.get_object()
        return Response(repr(model))
