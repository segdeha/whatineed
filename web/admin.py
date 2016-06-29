from django.contrib import admin
from .models import Thing, People, Purchase

admim.site.register(Thing)
admim.site.register(People)
admim.site.register(Purchase)
