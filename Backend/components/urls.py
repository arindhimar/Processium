from django.urls import path
from components.views import ComponentListCreateView, ComponentDetailView, ComponentTitleListView

urlpatterns = [
    path('', ComponentListCreateView.as_view(), name='component_list_create'),
    path('titles/', ComponentTitleListView.as_view(), name='component_title_list'),
    path('<uuid:component_id>/', ComponentDetailView.as_view(), name='component_detail'),
]
