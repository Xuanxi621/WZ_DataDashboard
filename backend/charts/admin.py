from django.contrib import admin
from .models import (
    City, TimeSeriesData, Statistics, LineChartData,
    PieData, BarData, TableData
)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'population', 'gdp', 'area']
    list_filter = ['created_at']
    search_fields = ['name']


@admin.register(TimeSeriesData)
class TimeSeriesDataAdmin(admin.ModelAdmin):
    list_display = ['date', 'current_year_value', 'last_year_value']
    list_filter = ['created_at']
    ordering = ['date']


@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    list_display = ['total_revenue', 'company_count', 'updated_at']


@admin.register(LineChartData)
class LineChartDataAdmin(admin.ModelAdmin):
    list_display = ['index', 'value']
    ordering = ['index']


@admin.register(PieData)
class PieDataAdmin(admin.ModelAdmin):
    list_display = ['name', 'value', 'order']
    ordering = ['order']


@admin.register(BarData)
class BarDataAdmin(admin.ModelAdmin):
    list_display = ['category', 'value', 'order']
    ordering = ['order']


@admin.register(TableData)
class TableDataAdmin(admin.ModelAdmin):
    list_display = ['province', 'patent_number', 'penalty_amount', 'year_over_year_percent']
    list_filter = ['created_at']
    search_fields = ['province', 'patent_number']

