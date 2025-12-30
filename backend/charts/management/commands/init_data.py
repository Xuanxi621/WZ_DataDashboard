"""
初始化数据的Django管理命令
用法: python manage.py init_data
"""
from django.core.management.base import BaseCommand
from charts.models import (
    City, TimeSeriesData, Statistics, LineChartData,
    PieData, BarData, TableData
)


class Command(BaseCommand):
    help = '初始化图表数据'

    def handle(self, *args, **options):
        self.stdout.write('开始初始化数据...')

        # 初始化城市数据
        cities_data = [
            {'name': '成都市', 'population': 2000, 'gdp': '1.8万亿', 'area': '14335平方公里'},
            {'name': '绵阳市', 'population': 500, 'gdp': '3500亿', 'area': '11234平方公里'},
            {'name': '德阳市', 'population': 400, 'gdp': '2800亿', 'area': '5951平方公里'},
            {'name': '乐山市', 'population': 350, 'gdp': '2200亿', 'area': '12723平方公里'},
            {'name': '眉山市', 'population': 300, 'gdp': '1800亿', 'area': '7148平方公里'},
        ]
        for city_data in cities_data:
            City.objects.get_or_create(
                name=city_data['name'],
                defaults=city_data
            )
        self.stdout.write(self.style.SUCCESS(f'✓ 已初始化 {len(cities_data)} 个城市数据'))

        # 初始化时间序列数据
        TimeSeriesData.objects.all().delete()
        for i in range(30):
            TimeSeriesData.objects.create(
                date=f"{i + 1:02d}",
                current_year_value=round(i * 1000 * (0.5 + 0.5 * (i % 3))),
                last_year_value=round(i * 1050 * (0.5 + 0.5 * (i % 3)))
            )
        self.stdout.write(self.style.SUCCESS('✓ 已初始化时间序列数据'))

        # 初始化统计数据
        Statistics.objects.get_or_create(
            id=1,
            defaults={
                'total_revenue': 99608.00,
                'company_count': 7792
            }
        )
        self.stdout.write(self.style.SUCCESS('✓ 已初始化统计数据'))

        # 初始化折线图数据
        LineChartData.objects.all().delete()
        line_data = [270, 400, 380, 420, 300, 410, 400, 330, 210, 290]
        for i, value in enumerate(line_data):
            LineChartData.objects.create(index=i, value=value)
        self.stdout.write(self.style.SUCCESS('✓ 已初始化折线图数据'))

        # 初始化饼图数据
        PieData.objects.all().delete()
        pie_data = [
            {'name': '第一季度', 'value': 20, 'order': 0},
            {'name': '第二季度', 'value': 10, 'order': 1},
            {'name': '第三季度', 'value': 30, 'order': 2},
            {'name': '第四季度', 'value': 40, 'order': 3},
        ]
        for data in pie_data:
            PieData.objects.create(**data)
        self.stdout.write(self.style.SUCCESS('✓ 已初始化饼图数据'))

        # 初始化柱状图数据
        BarData.objects.all().delete()
        bar_data = [
            {'category': '50万以下', 'value': 3000, 'order': 0},
            {'category': '50～100万', 'value': 2000, 'order': 1},
            {'category': '100～500万', 'value': 4000, 'order': 2},
            {'category': '500～1000万', 'value': 5000, 'order': 3},
            {'category': '1000万以上', 'value': 4500, 'order': 4},
        ]
        for data in bar_data:
            BarData.objects.create(**data)
        self.stdout.write(self.style.SUCCESS('✓ 已初始化柱状图数据'))

        # 初始化表格数据
        TableData.objects.all().delete()
        import random
        city_names = ['成都市', '绵阳市', '德阳市', '乐山市', '眉山市', '广安市', '南充市', '达州市']
        for i, city in enumerate(city_names):
            TableData.objects.create(
                province=city,
                patent_number=f"ZL{random.randint(1000000, 9999999)}",
                penalty_amount=round(random.random() * 1000, 2),
                year_over_year_percent=round(random.random() * 100, 2)
            )
        self.stdout.write(self.style.SUCCESS('✓ 已初始化表格数据'))

        self.stdout.write(self.style.SUCCESS('\n所有数据初始化完成！'))

