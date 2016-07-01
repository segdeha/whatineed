from django.shortcuts import render
from web.forms import UserForm

# Create your views here.

def register(request):
    # information from www.tangowithdjango.com
    context = RequestContext(request)
    registered = False

    if request.method == 'POST':
        user_form = UserForm(data=request.POST)
        if user_form.is_valid():
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            registered = True
        else:
            print user_form.errors
    else:
        user_form = UserForm()
        return render_to_response()
