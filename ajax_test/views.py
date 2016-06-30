from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from .models import Musician

def index(request):
    musicians = Musician.objects.all()
    return render(request, "ajax.html", {"musicians": musicians})

def increment_like(request, musician_name):
    musician_name = musician_name.replace("20%", " ")
    musician = Musician.objects.get(name=musician_name)
    musician.likes = musician.likes + 1
    musician.save()
    response = musician.likes
    return HttpResponse(response)
