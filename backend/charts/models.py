from django.db import models


class City(models.Model):
    """城市数据模型 - 用于图表1和图表3"""
    name = models.CharField(max_length=100, unique=True, verbose_name='城市名称')
    population = models.IntegerField(verbose_name='人口数量（万人）')
    gdp = models.CharField(max_length=50, verbose_name='GDP')
    area = models.CharField(max_length=50, verbose_name='面积')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'cities'
        verbose_name = '城市'
        verbose_name_plural = '城市'
        ordering = ['-population']

    def __str__(self):
        return self.name


class TimeSeriesData(models.Model):
    """时间序列数据模型 - 用于图表2"""
    date = models.CharField(max_length=10, verbose_name='日期')
    current_year_value = models.FloatField(verbose_name='今年同期值')
    last_year_value = models.FloatField(verbose_name='去年同期值')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        db_table = 'time_series_data'
        verbose_name = '时间序列数据'
        verbose_name_plural = '时间序列数据'
        ordering = ['date']

    def __str__(self):
        return f"{self.date}: {self.current_year_value} / {self.last_year_value}"


class Statistics(models.Model):
    """统计数据模型 - 用于图表4"""
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='收益总计（亿万元）')
    company_count = models.IntegerField(verbose_name='企业数量')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'statistics'
        verbose_name = '统计数据'
        verbose_name_plural = '统计数据'

    def __str__(self):
        return f"收益: {self.total_revenue}, 企业: {self.company_count}"


class LineChartData(models.Model):
    """折线图数据模型 - 用于图表4的折线图"""
    index = models.IntegerField(verbose_name='索引')
    value = models.FloatField(verbose_name='数值')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        db_table = 'line_chart_data'
        verbose_name = '折线图数据'
        verbose_name_plural = '折线图数据'
        ordering = ['index']

    def __str__(self):
        return f"Index {self.index}: {self.value}"


class PieData(models.Model):
    """饼图数据模型 - 用于图表5"""
    name = models.CharField(max_length=50, verbose_name='名称')
    value = models.IntegerField(verbose_name='数值')
    order = models.IntegerField(verbose_name='排序', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        db_table = 'pie_data'
        verbose_name = '饼图数据'
        verbose_name_plural = '饼图数据'
        ordering = ['order']

    def __str__(self):
        return f"{self.name}: {self.value}"


class BarData(models.Model):
    """柱状图数据模型 - 用于图表6"""
    category = models.CharField(max_length=50, verbose_name='分类')
    value = models.IntegerField(verbose_name='数值')
    order = models.IntegerField(verbose_name='排序', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        db_table = 'bar_data'
        verbose_name = '柱状图数据'
        verbose_name_plural = '柱状图数据'
        ordering = ['order']

    def __str__(self):
        return f"{self.category}: {self.value}"


class TableData(models.Model):
    """表格数据模型 - 用于图表3"""
    province = models.CharField(max_length=50, verbose_name='省份')
    patent_number = models.CharField(max_length=50, verbose_name='专利编号')
    penalty_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='处罚金额')
    year_over_year_percent = models.FloatField(verbose_name='同比百分比')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        db_table = 'table_data'
        verbose_name = '表格数据'
        verbose_name_plural = '表格数据'
        ordering = ['-penalty_amount']

    def __str__(self):
        return f"{self.province}: {self.patent_number}"

