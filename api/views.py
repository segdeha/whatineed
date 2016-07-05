from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from django.db.models import lookups
from django.contrib.auth import authenticate, login
from web.models import Thing, Purchase
from django.contrib.auth.models import User
import datetime # not sure if this is needed

# Create your views here.

# Given a barcode number return object with information about that product
def barcode(request, barcode_number):
    try:
        # Return Success format from jsonapi.org/format
        data = dict(Thing.objects.filter(barcode = barcode_number).values().first())
        json_object = {'data':data, 'self': '/api/thing/' + barcode_number}
    except TypeError:
        # Return Error format from jsonapi.org/format
        data = None
        title = 'No Item Found'
        detail = 'There was no item in our records that matched the barcode you supplied.'
        error = {'status':"404 Not Found", 'title':title,'detail':detail}
        json_object = {'errors' : error, 'data': data}
    return JsonResponse(json_object)

def purchase(request):
    pass

def things_list(request, user_id):
    data = dict(Thing.objects.filter(owner_id = user_id).values().first())
    json_object = {'data':data}
    return JsonResponse(json_object)

# Login authentication
def login(request):
    try:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password).__dict__
        user_id = user['id']
        json_object = {'data':{'user_id':user_id}}
        return JsonResponse(json_object)
    except:
        json_object = {'errors':{'title' : 'No Post Data', 'detail' : 'there was no post data in your request'}}
        return JsonResponse(json_object)
