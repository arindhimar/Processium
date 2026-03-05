from django.urls import path
from components.views import (
    ComponentListCreateView, ComponentDetailView, ComponentTitleListView,
    RatingScaleListCreateView, RatingScaleDetailView,
    ScoringParameterListCreateView, ScoringParameterDetailView,
)

urlpatterns = [
    # Components
    path('', ComponentListCreateView.as_view(), name='component_list_create'),
    path('titles/', ComponentTitleListView.as_view(), name='component_title_list'),
    path('<uuid:component_id>/', ComponentDetailView.as_view(), name='component_detail'),

    # Rating Scales
    path('rating-scales/', RatingScaleListCreateView.as_view(), name='rating_scale_list_create'),
    path('rating-scales/<uuid:scale_id>/', RatingScaleDetailView.as_view(), name='rating_scale_detail'),

    # Scoring Parameters
    path('scoring-parameters/', ScoringParameterListCreateView.as_view(), name='scoring_param_list_create'),
    path('scoring-parameters/<uuid:param_id>/', ScoringParameterDetailView.as_view(), name='scoring_param_detail'),
]
