# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

from example_app.models import *

import os
import re
import shutil
import sys
import tempfile
import base64
import requests
import json
import datetime

def index(request):
    ohlc = OHLC()
    host = request.META['HTTP_HOST']
    if request.method == "POST":
        args = request.POST
        print("args:",args)
        results = OHLC.objects.filter(ticker=args['ticker'])
        print(results)
        return render(
            request, 'example_app/example_app.html', 
            {
                'ticker':args['ticker'], 
                'start':args['start'], 
                'end':args['end'], 
                'array_table':results
            })

    return render(request,'example_app/example_app.html', {})

def db_init(request):
    csv_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
        __file__))), 'example_db', 'csv')
    csv_files = os.listdir(csv_dir)

    for tfile in csv_files:
        handle = open(os.path.join(csv_dir, tfile), 'r')
        ticker = os.path.splitext(tfile)[0]
        print(ticker)
        lines = handle.readlines()
        handle.close()
        columns = re.split(',', lines[0].rstrip())
        
        for line in lines[1:]:
            values = re.split(',', line.rstrip())
            ohlc_dict = dict(zip(columns, values))
            if ohlc_dict['High']: 
                ohlc = OHLC(
                    ticker=ticker,
                    date=ohlc_dict['Date'],
                    high=float(ohlc_dict['High']),
                    opening=float(ohlc_dict['Open']),
                    low=float(ohlc_dict['Low']),
                    close=float(ohlc_dict['Close']),
                    volume=float(ohlc_dict['Volume']),
                    adj_close=float(ohlc_dict['Adj Close']),
                )
                ohlc.save()

    host = request.META['HTTP_HOST']
    if request.method == "POST":
        args = request.POST
        print("args:",args)
    params = {}    
    return render(request, 'example_app/poop.html', params)
