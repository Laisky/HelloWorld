#! /usr/bin/env python
# -*- coding: utf-8
import random

from django.views.generic import ListView, View
from django.utils import timezone
# from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections

from .models import Posts


class PostListView(ListView):

    model = Posts

    def get_context_data(self, **kwargs):
        context = super(PostListView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context


class OpHandler(View):

    def get(self, request):
        # ORM
        p1 = Posts.objects.create(post_name=str(random.random()))
        p1.save()

        # low level
        db = connections['nosql'].get_collection(Posts._meta.db_table)
        p2 = db.insert({'post_title': str(random.random())})

        return HttpResponse('p1: {}<br>p2: {}'.format(p1.id, p2))
