from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from templates.models import Template
from templates.serializers import TemplateSerializer, TemplateCreateUpdateSerializer
from templates.permissions import IsAdminUser
from utils.logger import get_logger, get_file_logger, log_audit

logger = get_logger(__name__)
file_logger = get_file_logger(__name__)


class TemplateListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        msg = "Listing all templates | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        templates = Template.objects.all()
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        msg = "Creating template | user=%s"
        logger.info(msg, request.user.email)
        file_logger.info(msg, request.user.email)
        serializer = TemplateCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            template = Template.objects.create(
                template_name=serializer.validated_data['template_name'],
                template_description=serializer.validated_data.get('template_description', ''),
                created_by=request.user
            )
            msg2 = "Template created | id=%s name=%s"
            logger.info(msg2, template.id, template.template_name)
            file_logger.info(msg2, template.id, template.template_name)
            log_audit('template', template.id, 'create', request.user.id, new_data={'name': template.template_name})
            return Response(TemplateSerializer(template).data, status=status.HTTP_201_CREATED)
        logger.warning("Template creation failed | errors=%s", serializer.errors)
        file_logger.warning("Template creation failed | errors=%s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_template(self, template_id):
        try:
            return Template.objects.get(id=template_id)
        except Template.DoesNotExist:
            logger.warning("Template not found | id=%s", template_id)
            file_logger.warning("Template not found | id=%s", template_id)
            return None

    def get(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)
        msg = "Fetching template | id=%s name=%s"
        logger.info(msg, template.id, template.template_name)
        file_logger.info(msg, template.id, template.template_name)
        return Response(TemplateSerializer(template).data, status=status.HTTP_200_OK)

    def put(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)

        old_name = template.template_name
        serializer = TemplateCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            template.template_name = serializer.validated_data['template_name']
            template.template_description = serializer.validated_data.get('template_description', '')
            template.save()
            msg = "Template updated | id=%s name=%s"
            logger.info(msg, template.id, template.template_name)
            file_logger.info(msg, template.id, template.template_name)
            log_audit('template', template.id, 'update', request.user.id, old_data={'name': old_name}, new_data={'name': template.template_name})
            return Response(TemplateSerializer(template).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)
        deleted_name = template.template_name
        template.delete()
        msg = "Template deleted | id=%s"
        logger.info(msg, template_id)
        file_logger.info(msg, template_id)
        log_audit('template', template_id, 'delete', request.user.id, old_data={'name': deleted_name})
        return Response({"message": "Template deleted successfully."}, status=status.HTTP_200_OK)
