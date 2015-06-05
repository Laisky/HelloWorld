#! /usr/bin/env python
# -*- coding: utf-8
import logging

from django.views.generic import View
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse

from .forms import LoginForm


logger = logging.getLogger(settings.LOG_NAME)


class Register(View):

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
        if user is not None:
            auth.login(request, user)
            request.session['username'] = username
            # return HttpResponseRedirect('/user/profile/')
            return HttpResponse('Login in OK')
        else:
            return HttpResponse('Login in Error')
