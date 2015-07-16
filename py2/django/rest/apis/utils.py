#! /usr/bin/env python
# -*- coding: utf-8
from __future__ import unicode_literals, absolute_import

from rest_framework_jwt.authentication import JSONWebTokenAuthentication


def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'jwt': token,
        'username': user.username
    }


class JwtCookiesAuthentication(JSONWebTokenAuthentication):
    def get_jwt_value(self, request):
        return request.QUERY_PARAMS.get('token') or request.COOKIES.get('token')

    def authenticate(self, request):
        token = super(JwtCookiesAuthentication, self).authenticate(request)
        if token:
            user, jwt_value = token
            request.user = user
            request.session['jwt'] = jwt_value
        return token
