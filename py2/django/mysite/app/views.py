import datetime

from django.http import HttpResponse
from django.shortcuts import render_to_response


def current_datetime(request, offset):
    now = datetime.datetime.now()
    html = "<html><body>It is now {}.{}</body></html>".format(now, offset)
    return HttpResponse(html)


def template_demo(request):
    return render_to_response('demo.html', {'name': 'Laisky'})
