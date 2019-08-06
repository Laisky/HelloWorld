from django.conf.urls import patterns, include, url
from django.contrib import admin


admin.autodiscover()


urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^simple/', include('simple.urls'), name='simple'),
    url(r'^quick/', include('quickstart.urls'), name='quick'),
    url(r'^api/', include('apis.urls'), name='apis'),
)
