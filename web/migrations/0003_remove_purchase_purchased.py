# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-06 23:10
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0002_remove_purchase_consumed_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='purchase',
            name='purchased',
        ),
    ]
