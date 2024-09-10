from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, viewsets, permissions
from .serializers import UsuarioSerializer, PublicacionesSerializer
from django.contrib.auth import authenticate
from .models import Usuario, Publicaciones, Voto
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action


# Create your views here.


@api_view(["POST"])
def login(request):
    nombre_usuario = request.data.get("nombre_usuario")
    password = request.data.get("password")

    # Verificar que se haya proporcionado un nombre de usuario y una contraseña
    if not nombre_usuario or not password:
        return Response(
            {"detail": "Nombre de usuario y contraseña son requeridos."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Autenticación usando nombre de usuario
    user = authenticate(username=nombre_usuario, password=password)

    if user is not None:
        # Genera un token para el usuario
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UsuarioSerializer(user).data},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"detail": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
def register(request):
    serializer = UsuarioSerializer(data=request.data)

    # Validamos los datos que llegan
    if serializer.is_valid():
        # Creamos el usuario
        user = serializer.save()

        # Generamos el token de autenticación para el usuario
        token = Token.objects.create(user=user)
        return Response(
            {"token": token.key, "user": UsuarioSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vista
# ___________________________________________


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UsuarioSerializer


class PublicacionesViewSet(viewsets.ModelViewSet):
    queryset = Publicaciones.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PublicacionesSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=True, methods=["post"])
    def votar(self, request, pk=None):
        publicacion = self.get_object()
        usuario = request.user
        es_me_gusta = request.data.get("es_me_gusta")

        if Voto.objects.filter(usuario=usuario, publicacion=publicacion).exists():
            return Response(
                {"detail": "Ya has votado esta publicación"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Voto.objects.create(
            usuario=usuario, publicacion=publicacion, es_me_gusta=es_me_gusta
        )

        if es_me_gusta:
            publicacion.me_gusta += 1
        else:
            publicacion.no_me_gusta += 1

        publicacion.save()

        return Response(
            {"me_gusta": publicacion.me_gusta, "no_me_gusta": publicacion.no_me_gusta}
        )
