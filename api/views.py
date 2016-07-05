from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from django.db.models import lookups
from django.contrib.auth import authenticate, login
from web.models import Thing
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

# Given a username generate a list or dictionary of objects
def people_need(request,username):
    data = None #define data here!
    # /people/id/list/need
    json_object = {'data':data, 'self': '/people/'+ username +'/list/need' + barcode_number}
    try:
        # Look up username
        # If the username is found, try looking up needs:
        pass
        try:
            # Look up history
            data = None # Replace
            json_object = {'data':data, 'self': '/api/thing/' + barcode_number}
            pass
        except TypeError:
            # Needs Not Found
            title = 'No items found'
            detail = 'User does not need any items'
            error = {'status':"404 Not Found", 'title':title,'detail':detail}
            json_object = {'errors': error, 'data' : data }
            return JsonResponse(json_object)
    except TypeError:
        # If you are here username look up failed
        title = 'Username Not Found'
        detail = 'There was no username in our records that matches that request'
        error = {'status':"404 Not Found", 'title':title,'detail':detail}
        json_object = {'errors': error, 'data' : data }
        return JsonResponse(json_object)

# Given a username generate a list or dictionary of objects
def people_done(request,username):
    data = None #define data here!
    # /people/id/list/need
    json_object = {'data':data, 'self': '/people/'+ username +'/list/done' + barcode_number}
    try:
        # Look up username
        # If the username is found, try looking up needs:
        pass
        try:
            # Look up history
            pass
        except TypeError:
            # done Not Found
            title = 'No items found'
            detail = 'User has not finished any items'
            error = {'status':"404 Not Found", 'title':title,'detail':detail}
            json_object = {'errors': error, 'data' : data }
            return JsonResponse(json_object)
    except TypeError:
        # If you are here username look up failed
        title = 'Username Not Found'
        detail = 'There was no username in our records that matches that request'
        error = {'status':"404 Not Found", 'title':title,'detail':detail}
        json_object = {'errors': error, 'data' : data }
        return JsonResponse(json_object)

#
def people_usage(request,username,barcode_number):
    pass

#
def people_purchase(request,username,barcode_number):
    pass

# Login authentication
def login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        #return JSON Success
        json_object = {'data': {'user':username, 'is_registered' : True}}
        return JsonResponse(json_object)
    else:
        #return JSON Failure
        json_object = { 'errors' : { 'title': 'User Not Found', 'detail': 'user not registered'} }
        return JsonResponse(json_object)
