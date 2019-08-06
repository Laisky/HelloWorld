#! /usr/bin/env python
# -*- coding: utf-8
from django.db import models


class Posts(models.Model):
    _DATABASE = 'nosql'

    class Meta:
        db_table = 'posts'

    # _id = models.CharField()
    post_name = models.CharField()
    post_content = models.TextField()
    post_markdown = models.CharField()
    post_type = models.CharField()
    post_modified_gmt = models.DateField(auto_now=True)
    post_status = models.CharField()
    post_author = models.CharField()
    post_title = models.CharField()
    comment_status = models.CharField()
