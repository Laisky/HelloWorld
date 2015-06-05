#! /usr/bin/env python
# -*- coding: utf-8
import logging

from django.views.generic import View
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.conf import settings


logger = logging.getLogger(settings.LOG_NAME)


class Registry(View):

    def get(self, request):
        return render(request, 'user/register.html', {
            'usage': 'register',
            'register_content': UserCreationForm().as_p(),
        })

    def post(self, request):
        username = request.POST.get('username')
        logger.debug('POST with {}'.format(request.POST))

        user = UserCreationForm(request.POST)
        if user.is_valid():
            return render(request, 'user/register.html', {
                'usage': 'welcome',
                'username': username,
            })
        else:
            return render(request, 'user/register.html', {
                'usage': 'error',
                'username': username,
            })
