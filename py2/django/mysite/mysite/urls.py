from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns(
    '',
    url(
        regex=r'^admin/',
        view=include(admin.site.urls),
        name='admin'
    ),
)

urlpatterns += patterns(
    'mysite.views',
    url(
        regex=r'^time/plus/(\d{1,2})$',
        view='current_datetime',
        name='mysite.datetime'
    ),
)

urlpatterns += patterns(
    'app.views',
    url(
        regex=r'^template$',
        view='template_demo',
        name='app.template'
    ),
)
