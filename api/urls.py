from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [

    # /thing/barcodenumber -> json object for unique thing
    url(r'thing/(?P<barcode_number>[0-9]+)/', views.barcode ),

    # /people/<username>/list/need
    url(r'people/(?P<username>\w+)/list/need', views.people_need),

    # /people/<username>/history/done
    url(r'people/(?P<username>\w+)/list/done', views.people_done),

    # /people/<username>/history/purchased
    # this may have to be changed because accessing this link will update purchased history
    url(r'people/(?P<username>\w+)/history/(?P<barcode_number>[0-9]+)/purchased', views.people_purchase),

    # /people/<username>/history/usage
    # this may have to be changed because accessing this link will update usage history
    # need to look into best practices, because it seems to me you don't want a plain url being able to edit the database.
    url(r'people/(?P<username>\w+)/history/(?P<barcode_number>[0-9]+)/usage', views.people_usage),
]
