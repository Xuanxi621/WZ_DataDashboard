from rest_framework import serializers
from .models import (
    City, TimeSeriesData, Statistics, LineChartData,
    PieData, BarData, TableData
)


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'population', 'gdp', 'area']


class TimeSeriesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesData
        fields = ['id', 'date', 'current_year_value', 'last_year_value']


class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistics
        fields = ['id', 'total_revenue', 'company_count']


class LineChartDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineChartData
        fields = ['id', 'index', 'value']


class PieDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieData
        fields = ['id', 'name', 'value', 'order']


class BarDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarData
        fields = ['id', 'category', 'value', 'order']


class TableDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        fields = ['id', 'province', 'patent_number', 'penalty_amount', 'year_over_year_percent']

