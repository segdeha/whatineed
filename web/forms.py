from django.contrib.auth.models import User
from django import forms

Class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    Class Meta:
        model = User
        fields = ('username', 'email', 'password')
