from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    City, TimeSeriesData, Statistics, LineChartData,
    PieData, BarData, TableData
)
from .serializers import (
    CitySerializer, TimeSeriesDataSerializer, StatisticsSerializer,
    LineChartDataSerializer, PieDataSerializer, BarDataSerializer,
    TableDataSerializer
)


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    """城市数据API - 用于图表1"""
    queryset = City.objects.all()
    serializer_class = CitySerializer

    @action(detail=False, methods=['get'])
    def top_cities(self, request):
        """获取人口前5的城市"""
        top_cities = City.objects.all()[:5]
        serializer = self.get_serializer(top_cities, many=True)
        return Response(serializer.data)


class TimeSeriesDataViewSet(viewsets.ReadOnlyModelViewSet):
    """时间序列数据API - 用于图表2"""
    queryset = TimeSeriesData.objects.all()
    serializer_class = TimeSeriesDataSerializer


class StatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """统计数据API - 用于图表4"""
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """获取最新的统计数据"""
        latest = Statistics.objects.first()
        if latest:
            serializer = self.get_serializer(latest)
            return Response(serializer.data)
        return Response({})


class LineChartDataViewSet(viewsets.ReadOnlyModelViewSet):
    """折线图数据API - 用于图表4"""
    queryset = LineChartData.objects.all()
    serializer_class = LineChartDataSerializer


class PieDataViewSet(viewsets.ReadOnlyModelViewSet):
    """饼图数据API - 用于图表5"""
    queryset = PieData.objects.all()
    serializer_class = PieDataSerializer


class BarDataViewSet(viewsets.ReadOnlyModelViewSet):
    """柱状图数据API - 用于图表6"""
    queryset = BarData.objects.all()
    serializer_class = BarDataSerializer


class TableDataViewSet(viewsets.ReadOnlyModelViewSet):
    """表格数据API - 用于图表3"""
    queryset = TableData.objects.all()
    serializer_class = TableDataSerializer

