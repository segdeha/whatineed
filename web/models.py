
from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from datetime import timedelta

# Create your models here.


class Thing(models.Model):  #Things you will need to have to replenish in the household
    name = models.CharField(max_length=255, validators=[MaxLengthValidator(255)], blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    product_image = models.URLField()
    barcode = models.CharField(max_length=32, validators=[MaxLengthValidator(32)], blank=True)


class People(models.Model):  #People who are logged in to use the applications features
    name = models.CharField(max_length=255, validators=[MaxLengthValidator(255)], blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    last_modified_date = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=32, validators=[MaxLengthValidator(32)], blank=False)
    password = models.CharField(max_length=255, validators=[MinLengthValidator(6), MaxLengthValidator(255)], blank=False)
    number_in_household = models.PositiveSmallIntegerField(default=1, blank=False)
    email = models.EmailField(blank=False)


class Purchase(models.Model):

    STATES = (
        (0, 'IMMEDIATELY'),
        (1, 'SOON'),
        (2, 'LATER'),
        (3, 'INACTIVE'),
        )

    state = models.IntegerField(default=0, choices=STATES)
    thing_id = models.ForeignKey(Thing)
    owner_id = models.ForeignKey(People)
    purchased = models.BooleanField(default=False)
    estimated_number_of_days = models.PositiveSmallIntegerField(default=7, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    purchase_date = models.DateTimeField(auto_now=False, blank=True)
    consumed_date = models.DateTimeField(auto_now=False, blank=True)

    def duration(self):
        duration = self.consumed_time - self.purchase_time
        return duration
