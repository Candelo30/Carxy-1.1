from django import forms
from django.contrib.auth.forms import (
    UserCreationForm as BaseUserCreationForm,
    UserChangeForm as BaseUserChangeForm,
)
from .models import Usuario


class UserCreationForm(BaseUserCreationForm):
    class Meta:
        model = Usuario
        fields = (
            "correo",
            "nombre_usuario",
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "rol",
        )


class UserChangeForm(BaseUserChangeForm):
    class Meta:
        model = Usuario
        fields = (
            "correo",
            "nombre_usuario",
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "rol",
        )
