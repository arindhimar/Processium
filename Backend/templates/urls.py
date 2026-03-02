from django.urls import path
from templates.views import TemplateListCreateView, TemplateDetailView

urlpatterns = [
    path('', TemplateListCreateView.as_view(), name='template_list_create'),
    path('<uuid:template_id>/', TemplateDetailView.as_view(), name='template_detail'),
]
