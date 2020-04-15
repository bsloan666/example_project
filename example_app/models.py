# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class OHLC(models.Model):
    ticker = models.CharField(max_length=128)
    date = models.DateField() 
    high = models.FloatField()
    low =  models.FloatField()
    opening =  models.FloatField()
    close =  models.FloatField()
    volume =  models.FloatField()
    adj_close =  models.FloatField()
