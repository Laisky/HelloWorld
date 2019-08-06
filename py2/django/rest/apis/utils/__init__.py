#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import
from collections import Mapping
import logging

from django.contrib.auth.models import User
from django.conf import settings
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .encrypt import validate_token


log = logging.getLogger(settings.LOG_NAME)


def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'username': user.username
    }


class JwtCookiesAuthentication(JSONWebTokenAuthentication):
    def get_jwt_value(self, request):
        return request.QUERY_PARAMS.get('token') \
            or request.COOKIES.get('token')

    def authenticate(self, request):
        log.info('authenticate')
        token = self.get_jwt_value(request)

        try:
            payload = validate_token(token)
        except:
            log.debug('validate error')
            return None

        if not payload or not isinstance(payload, Mapping):
            return None

        username = payload.get('username')
        user = User.objects.filter(username=username).first()
        if not user:
            return None

        request.user = username
        return (user, token)
