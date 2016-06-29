from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from .models import Musician

def index(request):
    musicians = Musician.objects.all()
    return render(request, "ajax.html", {"musicians": musicians})
