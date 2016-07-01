from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [

    # /thing/barcodenumber -> json object for unique thing
    url(r'thing/(?P<barcode_number>[0-9]+)/', views.barcode ),

    # /people/id/list/need
    url(r'people/(?P<username>\w+)/list/need', views.people_need),

    # /people/id/history/done
    url(r'people/(?P<username>\w+)/list/done', views.people_done),

    # /people/id/history/purchased
    url(r'people/(?P<username>\w+)/history/(?P<barcode_number>[0-9]+)/purchased', views.people_purchase),

    # /people/id/history/usage
    url(r'people/(?P<username>\w+)/history/(?P<barcode_number>[0-9]+)/usage', views.people_usage),
]
