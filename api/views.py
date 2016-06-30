from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def send_items(request):
    items = [
        {"name": "eggs", "days":10},
        {"name": "eggs", "days":10},
        {"name": "eggs", "days":10}
    ]
    json = render(request, "items_and_days.json", items)
    return HttpResponse(json)
