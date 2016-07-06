from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from django.db.models import lookups
from django.contrib.auth import authenticate, login
from web.models import Thing, Purchase
from django.contrib.auth.models import User
from django.utils import timezone
import datetime
import pytz
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
    """Handle POST request of a new purchase:

    1. Update most recent purchase with a purchase datetime
    2. Create a new purchase record with a null purchase date

    """
    try:
        purchase_id = request.POST['purchase_id']
        p = Purchase.objects.get(id=purchase_id)
        p.purchase_date = timezone.now()
        p.save()
        # TODO calculate predicted_replace_days based on new state of purchases
        new_purchase = Purchase(state=2, thing_id=p.thing_id, owner_id=p.owner_id, predicted_replace_days=7)
        new_purchase.save()
        json_object = {'status':'200 OK'}
    except:
        json_object = {'errors':{'title' : 'No Post Data', 'detail' : 'there was no post data in your request'}}
    return JsonResponse(json_object)

def things_list(request, user_id):
    data = Purchase.objects.filter(owner_id = user_id, purchase_date = None).iterator() #sort by predicted_replace_days
    object_list = []
    for i in data:
        # get a list of all items of the same type
        item_iterator = Purchase.objects.filter(owner_id = user_id, thing_id = i.thing_id).order_by('purchase_date')
        # find the item that has the most recent purchase DateTimeField
        most_recent_purchase_date = item_iterator[len(item_iterator) - 1].purchase_date
        now = datetime.datetime.now().replace(tzinfo= pytz.utc)
        if most_recent_purchase_date == None:
            last_purchased = 'never'
        else:
            delta = (now - most_recent_purchase_date).days
        # get time delta between now and the most recent purchase DateTimeField


            # print(delta)
            if delta == 0:
                last_purchased = 'today'
            elif delta < 0:
                last_purchased = 'well done time traveler'
            elif delta > 0:
                year = delta // 365
                week = delta % 365 // 7
                days = delta % 365 % 7

                if year == 0 and week == 0 and days == 1:
                    last_purchased = 'yesterday'
                elif year == 0 and week == 0:
                    last_purchased = '{number} days ago'.format(number = days)
                elif year == 0 and week == 1:
                    last_purchased = 'about {week} week ago'.format(number = days, week = week)
                elif year == 0 and week > 1:
                    last_purchased = 'about {week} weeks ago'.format(number = days, week = week)
                elif year == 1:
                    last_purchased = 'about {year} year ago'.format(number = days, week = week, year = year)
                else:
                    last_purchased = 'about {year} years ago'.format(number = days, week = week, year = year)


            # make human readable

        purchase_id = i.id
        purchase_thing_id = i.thing_id.id
        name = i.thing_id.name
        status = i.read_state()
        src = i.thing_id.product_image # image

        new_object = {
            "thing_id": purchase_thing_id,
            "name": name,
            "status": status,
            "last_purchased": last_purchased, # date delta to juman readable or null to never
            "src": src,
            "purchase_id": purchase_id,
        }

        object_list.append(new_object)

    json_object = {'data':object_list}
    return JsonResponse(json_object)

# Login authentication
def login(request):
    try:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password).__dict__
        user_id = user['id']
        json_object = {'data':{'user_id':user_id}}
    except:
        json_object = {'errors':{'title' : 'No Post Data', 'detail' : 'there was no post data in your request'}}
    return JsonResponse(json_object)
