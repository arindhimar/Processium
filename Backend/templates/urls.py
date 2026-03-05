from django.urls import path
from templates.views import TemplateListCreateView, TemplateDetailView, TemplateCloneView

urlpatterns = [
    path('', TemplateListCreateView.as_view(), name='template_list_create'),
    path('<uuid:template_id>/', TemplateDetailView.as_view(), name='template_detail'),
    path('<uuid:template_id>/clone/', TemplateCloneView.as_view(), name='template_clone'),
]
