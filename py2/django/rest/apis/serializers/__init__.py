#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import MyModel
from .fields import MyCustField


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'mymodels')
    mymodels = serializers.HyperlinkedRelatedField(
        many=True, queryset=MyModel.objects.all(), view_name='model-detail'
    )


class MySerializer(serializers.ModelSerializer):

    options = MyCustField(
        max_length=1000, style={'base_template': 'textarea.html'},
    )

    class Meta:
        model = MyModel
        fields = ('id', 'owner', 'field', 'options')
        read_only_fields = ('owner',)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        validated_data['owner'] = self.context['request'].user
        return MyModel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.field = validated_data.get('field', instance.field)
        instance.save()
        return instance
