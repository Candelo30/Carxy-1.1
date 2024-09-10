from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario


class UsuarioAdmin(BaseUserAdmin):
    model = Usuario
    # Define los campos que deseas mostrar en la lista
    list_display = (
        "correo",
        "nombre_usuario",
        "primer_nombre",
        "is_staff",
        "is_active",
        "rol",
    )
    # Define los campos que deseas que aparezcan en el formulario de cambio
    fieldsets = (
        (None, {"fields": ("correo", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "nombre_usuario",
                    "primer_nombre",
                    "segundo_nombre",
                    "primer_apellido",
                    "segundo_apellido",
                    "rol",
                )
            },
        ),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        (
            "Important dates",
            {"fields": ()},
        ),  # Puedes dejar esto vacío si no necesitas campos de fechas
    )
    # Define los campos que deseas que aparezcan en el formulario de creación
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "correo",
                    "nombre_usuario",
                    "primer_nombre",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    # Indica qué campos deben usarse para la búsqueda
    search_fields = ("correo", "nombre_usuario", "primer_nombre")
    ordering = ("correo",)


admin.site.register(Usuario, UsuarioAdmin)
