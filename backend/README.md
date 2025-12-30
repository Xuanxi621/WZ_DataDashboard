# 数据可视化后端 API

基于 Django + MySQL 的数据可视化后端服务。

## 安装步骤

1. 创建虚拟环境（推荐）:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 安装依赖:
```bash
pip install -r requirements.txt
```

3. 配置数据库:
- 创建 MySQL 数据库:
```sql
CREATE DATABASE datav_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- 复制 `.env.example` 为 `.env` 并配置数据库连接信息:
```bash
cp .env.example .env
# 编辑 .env 文件，填入数据库信息
```

4. 运行数据库迁移:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. 初始化数据:
```bash
python manage.py init_data
```

6. 创建超级用户（可选）:
```bash
python manage.py createsuperuser
```

7. 启动开发服务器:
```bash
python manage.py runserver
```

服务器将在 http://127.0.0.1:8000 启动

## API 端点

- `GET /api/cities/` - 获取所有城市数据
- `GET /api/cities/top_cities/` - 获取人口前5的城市（用于图表1）
- `GET /api/time-series/` - 获取时间序列数据（用于图表2）
- `GET /api/statistics/latest/` - 获取最新统计数据（用于图表4）
- `GET /api/line-chart/` - 获取折线图数据（用于图表4）
- `GET /api/pie/` - 获取饼图数据（用于图表5）
- `GET /api/bar/` - 获取柱状图数据（用于图表6）
- `GET /api/table/` - 获取表格数据（用于图表3）

## 管理后台

访问 http://127.0.0.1:8000/admin/ 可以管理数据

