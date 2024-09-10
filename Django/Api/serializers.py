from rest_framework import serializers
from .models import *
import base64
from io import BytesIO
from django.core.files.base import ContentFile


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"  # Lista explícitamente los campos si prefieres control total
        extra_kwargs = {
            "password": {"write_only": True},  # 'password' en lugar de 'contrasena'
        }


class PublicacionesSerializer(serializers.ModelSerializer):
    # Serializa el usuario completo
    nombre_usuario = UsuarioSerializer(read_only=True)
    # Campo adicional para mostrar el nombre de usuario
    nombre_usuario_display = serializers.SerializerMethodField()

    class Meta:
        model = Publicaciones
        fields = "__all__"

    def get_nombre_usuario_display(self, obj):
        return obj.nombre_usuario.nombre_usuario

    def validate(self, data):
        # Validación personalizada para asegurar que 'me_gusta' y 'no_me_gusta' estén presentes
        if "me_gusta" not in data or "no_me_gusta" not in data:
            raise serializers.ValidationError(
                "Los campos 'me_gusta' y 'no_me_gusta' son obligatorios."
            )
        return data
