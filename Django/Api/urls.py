from rest_framework import routers

from .views import UsuarioViewSet, PublicacionesViewSet


router = routers.DefaultRouter()

router.register("api/usuario", UsuarioViewSet, basename="usuario")

router.register("api/publicaciones", PublicacionesViewSet, basename="publicaciones")

urlpatterns = router.urls
