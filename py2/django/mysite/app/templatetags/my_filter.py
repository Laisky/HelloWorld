from django import template


register = template.Library()


@register.filter
def my_lower(val):
    return val.lower()
