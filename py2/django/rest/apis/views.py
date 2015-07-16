#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import User
from rest_framework import generics, permissions, renderers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import MySerializer, UserSerializer
from .models import MyModel


@api_view(('GET',))
@permission_classes((permissions.AllowAny,))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'models': reverse('model-list', request=request, format=format)
    })


class DetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    queryset = MyModel.objects.all()
    serializer_class = MySerializer


class ListView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    # renderer_classes = (renderers.StaticHTMLRenderer,)

    queryset = MyModel.objects.all()
    serializer_class = MySerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserList(generics.ListCreateAPIView):
    # renderer_classes = (renderers.StaticHTMLRenderer,)

    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
