from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from components.models import Component, RatingScale, ScoringParameter
from components.serializers import (
    ComponentSerializer, ComponentCreateUpdateSerializer, ComponentTitleSerializer,
    RatingScaleSerializer, RatingScaleCreateUpdateSerializer,
    ScoringParameterSerializer, ScoringParameterCreateUpdateSerializer,
)
from templates.permissions import IsAdminUser
from utils.logger import get_logger, get_file_logger, log_audit

logger = get_logger(__name__)
file_logger = get_file_logger(__name__)


# ── Component Views ───────────────────────────────────────────────────────────

class ComponentListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        msg = "Listing all components | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        components = Component.objects.all()
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        msg = "Creating component | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        serializer = ComponentCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            component = Component.objects.create(
                name=serializer.validated_data['name'],
                schema=serializer.validated_data['schema'],
            )
            msg2 = "Component created | id=%s name=%s"
            logger.info(msg2, component.id, component.name)
            file_logger.info(msg2, component.id, component.name)
            log_audit('component', component.id, 'create', request.user.id, new_data={'name': component.name})
            return Response(ComponentSerializer(component).data, status=status.HTTP_201_CREATED)
        logger.warning("Component creation failed | errors=%s", serializer.errors)
        file_logger.warning("Component creation failed | errors=%s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComponentTitleListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        logger.info("Listing component titles | user=%s", request.user.email)
        components = Component.objects.all()
        serializer = ComponentTitleSerializer(components, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ComponentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_component(self, component_id):
        try:
            return Component.objects.get(id=component_id)
        except Component.DoesNotExist:
            logger.warning("Component not found | id=%s", component_id)
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

        old_name = component.name
        serializer = ComponentCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            component.name = serializer.validated_data['name']
            component.schema = serializer.validated_data['schema']
            component.save()
            msg = "Component updated | id=%s name=%s"
            logger.info(msg, component.id, component.name)
            file_logger.info(msg, component.id, component.name)
            log_audit('component', component.id, 'update', request.user.id, old_data={'name': old_name}, new_data={'name': component.name})
            return Response(ComponentSerializer(component).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, component_id):
        component = self._get_component(component_id)
        if not component:
            return Response({"error": "Component not found."}, status=status.HTTP_404_NOT_FOUND)
        deleted_name = component.name
        component.delete()
        msg = "Component deleted | id=%s"
        logger.info(msg, component_id)
        file_logger.info(msg, component_id)
        log_audit('component', component_id, 'delete', request.user.id, old_data={'name': deleted_name})
        return Response({"message": "Component deleted successfully."}, status=status.HTTP_200_OK)


# ── Rating Scale Views ────────────────────────────────────────────────────────

class RatingScaleListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        msg = "Listing rating scales | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        scales = RatingScale.objects.filter(is_active=True)
        serializer = RatingScaleSerializer(scales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        msg = "Creating rating scale | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        serializer = RatingScaleCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            scale = RatingScale.objects.create(**serializer.validated_data)
            msg2 = "Rating scale created | id=%s value=%s label=%s"
            logger.info(msg2, scale.id, scale.value, scale.label)
            file_logger.info(msg2, scale.id, scale.value, scale.label)
            return Response(RatingScaleSerializer(scale).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingScaleDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_scale(self, scale_id):
        try:
            return RatingScale.objects.get(id=scale_id)
        except RatingScale.DoesNotExist:
            return None

    def put(self, request, scale_id):
        scale = self._get_scale(scale_id)
        if not scale:
            return Response({"error": "Rating scale not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RatingScaleCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            scale.value = serializer.validated_data['value']
            scale.label = serializer.validated_data['label']
            scale.description = serializer.validated_data.get('description', '')
            scale.is_active = serializer.validated_data.get('is_active', True)
            scale.save()
            msg = "Rating scale updated | id=%s"
            logger.info(msg, scale.id)
            file_logger.info(msg, scale.id)
            return Response(RatingScaleSerializer(scale).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, scale_id):
        scale = self._get_scale(scale_id)
        if not scale:
            return Response({"error": "Rating scale not found."}, status=status.HTTP_404_NOT_FOUND)
        scale.delete()
        msg = "Rating scale deleted | id=%s"
        logger.info(msg, scale_id)
        file_logger.info(msg, scale_id)
        return Response({"message": "Rating scale deleted successfully."}, status=status.HTTP_200_OK)


# ── Scoring Parameter Views ───────────────────────────────────────────────────

class ScoringParameterListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        msg = "Listing scoring parameters | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        params = ScoringParameter.objects.filter(is_active=True)
        serializer = ScoringParameterSerializer(params, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        msg = "Creating scoring parameter | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        serializer = ScoringParameterCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            param = ScoringParameter.objects.create(**serializer.validated_data)
            msg2 = "Scoring parameter created | id=%s name=%s"
            logger.info(msg2, param.id, param.name)
            file_logger.info(msg2, param.id, param.name)
            return Response(ScoringParameterSerializer(param).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScoringParameterDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_param(self, param_id):
        try:
            return ScoringParameter.objects.get(id=param_id)
        except ScoringParameter.DoesNotExist:
            return None

    def put(self, request, param_id):
        param = self._get_param(param_id)
        if not param:
            return Response({"error": "Scoring parameter not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ScoringParameterCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            param.name = serializer.validated_data['name']
            param.description = serializer.validated_data.get('description', '')
            param.is_active = serializer.validated_data.get('is_active', True)
            param.save()
            msg = "Scoring parameter updated | id=%s"
            logger.info(msg, param.id)
            file_logger.info(msg, param.id)
            return Response(ScoringParameterSerializer(param).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, param_id):
        param = self._get_param(param_id)
        if not param:
            return Response({"error": "Scoring parameter not found."}, status=status.HTTP_404_NOT_FOUND)
        param.delete()
        msg = "Scoring parameter deleted | id=%s"
        logger.info(msg, param_id)
        file_logger.info(msg, param_id)
        return Response({"message": "Scoring parameter deleted successfully."}, status=status.HTTP_200_OK)
