from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from templates.models import Template
from templates.serializers import TemplateSerializer, TemplateCreateUpdateSerializer
from templates.permissions import IsAdminUser


class TemplateListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        templates = Template.objects.all()
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TemplateCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            template = Template.objects.create(
                template_name=serializer.validated_data['template_name'],
                template_description=serializer.validated_data.get('template_description', ''),
                created_by=request.user
            )
            return Response(TemplateSerializer(template).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_template(self, template_id):
        try:
            return Template.objects.get(id=template_id)
        except Template.DoesNotExist:
            return None

    def get(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TemplateSerializer(template).data, status=status.HTTP_200_OK)

    def put(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = TemplateCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            template.template_name = serializer.validated_data['template_name']
            template.template_description = serializer.validated_data.get('template_description', '')
            template.save()
            return Response(TemplateSerializer(template).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, template_id):
        template = self._get_template(template_id)
        if not template:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)
        template.delete()
        return Response({"message": "Template deleted successfully."}, status=status.HTTP_200_OK)
