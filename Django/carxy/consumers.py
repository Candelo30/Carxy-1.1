import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from Api.models import Publicaciones, Voto


class LikeDislikeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        publicacion_id = text_data_json["publicacion_id"]
        es_me_gusta = text_data_json["es_me_gusta"]
        usuario_id = self.scope["user"].id

        # Obtener la publicación y el usuario
        publicacion = await Publicaciones.objects.get(id=publicacion_id)
        usuario = await User.objects.get(id=usuario_id)

        # Verificar si ya ha votado
        if not await Voto.objects.filter(
            usuario=usuario, publicacion=publicacion
        ).exists():
            voto = await Voto.objects.create(
                usuario=usuario, publicacion=publicacion, es_me_gusta=es_me_gusta
            )

            # Actualizar conteo de me gusta o no me gusta
            if es_me_gusta:
                publicacion.me_gusta += 1
            else:
                publicacion.no_me_gusta += 1

            await publicacion.save()

            # Enviar el mensaje a todos los clientes conectados
            await self.channel_layer.group_send(
                f"publicacion_{publicacion_id}",
                {
                    "type": "update_likes",
                    "me_gusta": publicacion.me_gusta,
                    "no_me_gusta": publicacion.no_me_gusta,
                },
            )

    async def update_likes(self, event):
        me_gusta = event["me_gusta"]
        no_me_gusta = event["no_me_gusta"]

        # Enviar el conteo actualizado al cliente
        await self.send(
            text_data=json.dumps({"me_gusta": me_gusta, "no_me_gusta": no_me_gusta})
        )
