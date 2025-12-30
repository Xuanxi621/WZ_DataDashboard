# 资源文件复制说明

请将以下文件从原项目复制到新项目中：

## 需要复制的文件

### JSON 文件（复制到 `src/assets/`）
- `src/assets/sc.json` → `src/assets/sc.json`
- `src/assets/sc_outline.json` → `src/assets/sc_outline.json`
- `src/assets/heatmapData.json` → `src/assets/heatmapData.json`

### PNG 图片（复制到 `src/assets/`）
- `src/assets/sc_normal_map.png` → `src/assets/sc_normal_map.png`
- `src/assets/sc_map.png` → `src/assets/sc_map.png`
- `src/assets/sc_displacement_map.png` → `src/assets/sc_displacement_map.png`
- `src/assets/rotationBorder2.png` → `src/assets/rotationBorder2.png`
- `src/assets/rotationBorder1.png` → `src/assets/rotationBorder1.png`
- `src/assets/gridBlack.png` → `src/assets/gridBlack.png`
- `src/assets/quan.png` → `src/assets/quan.png`
- `src/assets/line.png` → `src/assets/line.png`
- `src/assets/guangquan01.png` → `src/assets/guangquan01.png`
- `src/assets/huiguang.png` → `src/assets/huiguang.png`
- `src/assets/grid.png` → `src/assets/grid.png`
- `src/assets/cloud.png` → `src/assets/cloud.png`
- `src/assets/gaoguang1.png` → `src/assets/gaoguang1.png`

### JPG 图片（复制到 `src/assets/`）
- `src/assets/card_bg.jpg` → `src/assets/card_bg.jpg`

### Public 文件（复制到 `public/`）
- `public/vite.svg` → `public/vite.svg`（可选）

## 快速复制命令（在项目根目录执行）

### Windows PowerShell:
```powershell
# 复制 JSON 文件
Copy-Item "..\sc-datav\src\assets\*.json" -Destination "src\assets\" -Force

# 复制 PNG 文件
Copy-Item "..\sc-datav\src\assets\*.png" -Destination "src\assets\" -Force

# 复制 JPG 文件
Copy-Item "..\sc-datav\src\assets\*.jpg" -Destination "src\assets\" -Force
```

### Linux/Mac:
```bash
# 复制 JSON 文件
cp ../sc-datav/src/assets/*.json src/assets/

# 复制 PNG 文件
cp ../sc-datav/src/assets/*.png src/assets/

# 复制 JPG 文件
cp ../sc-datav/src/assets/*.jpg src/assets/
```

