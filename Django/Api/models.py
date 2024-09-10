from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo debe ser establecido")
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(correo, nombre_usuario, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    ROLES_CHOICES = [
        ("usuario", "Usuario"),
        ("administrador", "Administrador"),
    ]

    nombre_usuario = models.CharField(max_length=50, unique=True, default="")
    primer_nombre = models.CharField(max_length=50, default="")
    segundo_nombre = models.CharField(max_length=50, blank=True, default="")
    primer_apellido = models.CharField(max_length=50, default="")
    segundo_apellido = models.CharField(max_length=50, blank=True, default="")
    correo = models.EmailField(max_length=254, unique=True, default="")
    rol = models.CharField(max_length=20, choices=ROLES_CHOICES, default="usuario")

    # Campos adicionales requeridos por AbstractBaseUser
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "nombre_usuario"
    REQUIRED_FIELDS = ["correo, primer_nombre, primer_apellido"]

    def __str__(self):
        return self.nombre_usuario

    def get_full_name(self):
        return f"{self.primer_nombre} {self.segundo_nombre or ''} {self.primer_apellido} {self.segundo_apellido or ''}".strip()

    def get_short_name(self):
        return self.primer_nombre


class Publicaciones(models.Model):
    nombre_usuario = models.ForeignKey("Usuario", on_delete=models.CASCADE)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(default="")
    me_gusta = models.PositiveIntegerField(default=0)
    no_me_gusta = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to="imagenes/", blank=True, null=True)


class Voto(models.Model):
    usuario = models.ForeignKey("Usuario", on_delete=models.CASCADE)
    publicacion = models.ForeignKey("Publicaciones", on_delete=models.CASCADE)
    es_me_gusta = (
        models.BooleanField()
    )  # True si es "me gusta", False si es "no me gusta"

    class Meta:
        unique_together = ("usuario", "publicacion")
