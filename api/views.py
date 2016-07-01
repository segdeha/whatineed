from django.shortcuts import render
import json
import datetime

# Create your views here.

from django.http import JsonResponse,HttpResponse
from web.models import Thing
from django.db.models import lookups

def barcode(request, barcode_number):
    try:
        # Return Success from jsonapi.org/format
        data = dict(Thing.objects.filter(barcode = barcode_number).values().first())
        json_object = {'data':data, 'self': '/api/' + barcode_number}
    except TypeError:
        # Return Error from jsonapi.org/format
        data = None
        title = 'No Item Found'
        detail = 'There was no item in our records that matched the barcode you supplied.'
        error = {'status':"404 Not Found", 'title':title,'detail':detail}
        json_object = {'errors' : error, 'data': data}
    return JsonResponse(json_object)
