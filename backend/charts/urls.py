from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityViewSet, TimeSeriesDataViewSet, StatisticsViewSet,
    LineChartDataViewSet, PieDataViewSet, BarDataViewSet,
    TableDataViewSet
)

router = DefaultRouter()
router.register(r'cities', CityViewSet, basename='city')
router.register(r'time-series', TimeSeriesDataViewSet, basename='time-series')
router.register(r'statistics', StatisticsViewSet, basename='statistics')
router.register(r'line-chart', LineChartDataViewSet, basename='line-chart')
router.register(r'pie', PieDataViewSet, basename='pie')
router.register(r'bar', BarDataViewSet, basename='bar')
router.register(r'table', TableDataViewSet, basename='table')

urlpatterns = [
    path('', include(router.urls)),
]

