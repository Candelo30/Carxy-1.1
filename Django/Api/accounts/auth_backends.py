# accounts/auth_backends.py
from django.contrib.auth.backends import ModelBackend
from ..models import Usuario  # Asegúrate de importar el modelo correcto


class CustomBackend(ModelBackend):
    def authenticate(
        self, request, correo=None, nombre_usuario=None, password=None, **kwargs
    ):
        if correo:
            try:
                user = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return None
        elif nombre_usuario:
            try:
                user = Usuario.objects.get(nombre_usuario=nombre_usuario)
            except Usuario.DoesNotExist:
                return None
        else:
            return None

        if user.check_password(password):
            return user
        return None
