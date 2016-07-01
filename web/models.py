
from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from datetime import timedelta

import statistics as stats
import numpy as np

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
    purchase_date = models.DateTimeField(auto_now=False, blank=True, null=True)
    consumed_date = models.DateTimeField(auto_now=False, blank=True, null=True)
    predicted_replace_days = models.PositiveSmallIntegerField(blank=True)

    def duration(self):
        duration = self.consumed_time - self.purchase_time
        return duration

    def relevant_mean(user_predict, *args): # returns mean of data it deems relevant
        if isinstance(args[0], list):
            collected_data = args[0]
        else:
            collected_data = list(args)
        # add the initial user prediction to the beginning of our actual data
        all_data = [user_predict] + collected_data
        # user_predict and all args should be ints
        if not all(isinstance(item, int) for item in all_data):
                raise TypeError("predict() needs positive ints!")
                # is it worth checking for negative ints?
        if len(all_data) < 4: # if there's only 4 datapoints use all of them
            return int(stats.mean(all_data))
        elif len(all_data) < 10: # 10 is very arbitrary
            return int(np.percentile(all_data, 10)) # np.percentile excludes data outside the 80th percentile
        else: # only use the last ten data points
            return int(np.percentile(args[-10:], 10))
