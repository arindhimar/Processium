from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from components.models import Component
from components.models import Component
from components.serializers import ComponentSerializer, ComponentCreateUpdateSerializer, ComponentTitleSerializer
from templates.permissions import IsAdminUser


class ComponentListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        components = Component.objects.all()
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ComponentCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            component = Component.objects.create(
                name=serializer.validated_data['name'],
                schema=serializer.validated_data['schema'],
            )
            return Response(ComponentSerializer(component).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComponentTitleListView(APIView):
    permission_classes = [IsAuthenticated]  # Maybe everyone can view names, or maybe admin only? I'll use IsAuthenticated, IsAdminUser to match existing for safety.
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        components = Component.objects.values('id', 'name')
        # We can just return the raw values dict or use the serializer we made. Let's use the serializer
        components = Component.objects.all()
        serializer = ComponentTitleSerializer(components, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ComponentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_component(self, component_id):
        try:
            return Component.objects.get(id=component_id)
        except Component.DoesNotExist:
            return None

    def get(self, request, component_id):
        component = self._get_component(component_id)
        if not component:
            return Response({"error": "Component not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ComponentSerializer(component).data, status=status.HTTP_200_OK)

    def put(self, request, component_id):
        component = self._get_component(component_id)
        if not component:
            return Response({"error": "Component not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ComponentCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            component.name = serializer.validated_data['name']
            component.schema = serializer.validated_data['schema']
            component.save()
            return Response(ComponentSerializer(component).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, component_id):
        component = self._get_component(component_id)
        if not component:
            return Response({"error": "Component not found."}, status=status.HTTP_404_NOT_FOUND)
        component.delete()
        return Response({"message": "Component deleted successfully."}, status=status.HTTP_200_OK)
