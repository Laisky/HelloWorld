#! /usr/bin/env python
# -*- coding: utf-8
import logging

from django.views.generic import View
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator

from .forms import LoginForm


logger = logging.getLogger(settings.LOG_NAME)


class Register(View):
    """注册"""

    def get(self, request):
        return render(request, 'user/register.html', {
            'usage': 'register',
            'form': UserCreationForm(),
        })

    def post(self, request):
        username = request.POST.get('username')
        logger.debug('POST with {}'.format(request.POST))

        user = UserCreationForm(request.POST)
        if user.is_valid():
            user.save()
            return render(request, 'user/register.html', {
                'usage': 'welcome',
                'username': username,
            })
        else:
            return render(request, 'user/register.html', {
                'usage': 'error',
                'username': username,
            })


class Login(View):
    """登陆"""

    def get(self, request):
        return render(request, 'user/login.html', {
            'usage': 'login',
            'form': LoginForm()
        })

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        logger.debug('POST with {}'.format(request.POST))

        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            return HttpResponseRedirect('/user/authorized/')
        else:
            return HttpResponse('Login in Error')


class Logout(View):
    """登出"""

    @method_decorator(login_required)
    def post(self, request):
        auth.logout(request)


class Authorized(View):
    """登陆后可见的内容"""

    @method_decorator(login_required)
    def get(self, request):
        return render(request, 'user/authorized.html')
