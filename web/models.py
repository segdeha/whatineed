
from django.db import models
from django_enumfield import enum
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

# Create your models here.


class Things(models.Model):  #Things you will need to have to replenish in the household
    name = models.CharField(max_length=255, validators=[MaxValueValidator(255)], blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    product_image = models.URLField()
    upc = models.CharField(max_length=32, validators=[MaxValueValidator(32)], blank=True)


class States(enum.Enum): #The states of things when the once the have a purchase and usage dates
    IMMEDIATELY = 0
    SOON = 1
    LATER = 2
    INACTIVE = 3


class People(models.Model):  #People who are logged in to use the applications features
    name = models.CharField(max_length=255, validators=[MaxValueValidator(255)], blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=32, validators=[MaxValueValidator(32)], blank=False)
    password = models.CharField(max_length=255, validators=[MinValueValidator(6), MaxValueValidator(255)], blank=False)
    number_in_household = models.PositiveSmallIntegerField(default=1, blank=False)
    email = models.EmailField(blank=False)


class PurchaseHistory(models.Model):  #When things are first put in the systmem and its relationship to person and state
    thing_id = models.ForeignKey(Things)
    person_id = models.ForeignKey(People)
    purchase_date = models.DateTimeField(auto_now=True)


class UsageHistory(models.Model):  # when things are used up and its relationship to person and state
    thing_id = models.ForeignKey(Things)
    person_id = models.ForeignKey(People)
    done_date = models.DateTimeField(auto_now=True)
