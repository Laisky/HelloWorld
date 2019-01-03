#! /usr/bin/env python
# -*- coding: utf-8

"""Django Tags
Tags 相当于 函数，在模板里接受参数
"""

from django import template


register = template.Library()


@register.simple_tag
def my_simple_tag(val):
    return '{} with simple tag'.format(val)


@register.simple_tag(takes_context=True)
def my_simple_tag_with_context(context, val):
    return '{} with simple tag & context'.format(val)
