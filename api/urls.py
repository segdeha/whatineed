from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(r'(?P<barcode_number>[0-9]+)', views.barcode ),
]
