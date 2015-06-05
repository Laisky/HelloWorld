#! /usr/bin/env python
# -*- coding: utf-8

from django.views.generic import View
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render


class Registry(View):

    def get(self, request):
        return render(request, 'user/register.html', {
            'usage': 'register',
            'register_content': UserCreationForm().as_p(),
        })

    def post(self, request):
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

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
