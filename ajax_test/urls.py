from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^get-items/(?P<musician_name>[A-Za-z]+)', views.increment_like),
]
