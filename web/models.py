from django.db import models
from django_enumfield import enum

# Create your models here.


class Things(models.Model):
    name = models.CharField(max_length=255, required=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    product_image = models.URLField()
    upc = models.CharField(max_length=16, required=False)


class States(enum.Enum):
    IMMEDIATELY = 0
    SOON = 1
    LATER = 2
    INACTIVE = 3


class People(models.Model):
    name = models.CharField(max_length=255, required=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=32, required=True)
    password = models.CharField(min_length=6, max_length=255, required=True)
    number_in_household = models.PositiveSmallIntegerField(default=1, required=True)
    email = models.EmailField(required=True)


class PurchaseHistory(models.Model):
    thing_id = models.ForeignKey(Things)
    people_id = models.ForeignKey(People)
    purchase_date = models.DateTimeField(auto_now=True)


class UsageHistory(models.Model):
    thing_id = models.ForeignKey(Things)
    people_id = models.ForeignKey(People)
    done_date = models.DateTimeField(auto_now=True)