#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.forms import widgets
from rest_framework import serializers

from .models import MyModel


class MySerializer(serializers.Serializer):
    pk = serializers.IntegerField(read_only=True)
    field = serializers.CharField(max_length=100, required=True, style={'base_template': 'textarea.html'})

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return MyModel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.field = validated_data.get('field', instance.field)
        instance.save()
        return instance
