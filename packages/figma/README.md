# figma 插件项目开发

1. ## 技术栈

   react + ts +taiwind + shadcn ui

2. ## 项目启动
   直接 使用 npm run build 即可，然后去 figma 导入此插件运行

# Figma节点解析器

这个解析器可以将Figma设计稿转换为HTML或JSON结构，实现像素级还原设计稿。

## 功能特点

- 支持解析多种Figma节点类型
- 可以输出HTML或JSON格式
- 图片自动转换为base64格式
- 支持复制到剪贴板
- 保留设计稿的样式和布局
- 支持自动布局（Auto Layout）
- 支持嵌套组件

## 支持的节点类型

- 文本节点 (TEXT)
- 矩形节点 (RECTANGLE)
- 框架节点 (FRAME)
- 组节点 (GROUP)
- 椭圆节点 (ELLIPSE)
- 矢量节点 (VECTOR)
- 组件节点 (COMPONENT)
- 组件实例节点 (INSTANCE)
- 图片节点 (IMAGE)
- 线条节点 (LINE)

## 使用方法

### 在插件中使用

1. 在Figma中选择要解析的节点
2. 点击"解析为HTML"或"解析为JSON"按钮
3. 解析结果会自动复制到剪贴板
4. 可以将结果粘贴到代码编辑器或浏览器中查看

### 在代码中使用

```typescript
import { ParseManager } from '../parse';

// 创建解析管理器
const parseManager = new ParseManager({
  outputFormat: 'HTML', // 或 'JSON'
  htmlOptions: {
    inlineStyles: true,
    prettify: true,
    includeComments: true
  }
});

// 解析节点
const result = parseManager.parse(figmaNode);

// 解析节点并复制到剪贴板
await parseManager.parseAndCopy(figmaNode);

// 批量解析多个节点
const results = parseManager.parseMultiple(figmaNodes);
```

## HTML输出示例

```html
<!-- Figma FRAME: 主页面 -->
<div class="figma-frame-main-page-12345678" id="123:456" style="position: absolute; left: 0px; top: 0px; width: 1440px; height: 900px; background-color: rgb(255, 255, 255);">
  <!-- Figma TEXT: 标题 -->
  <p class="figma-text-title-87654321" id="123:457" style="position: absolute; left: 40px; top: 40px; font-size: 24px; font-family: 'Inter', sans-serif; font-weight: 700; color: rgb(0, 0, 0);">Hello World</p>
  
  <!-- Figma RECTANGLE: 按钮 -->
  <div class="figma-rectangle-button-abcdef12" id="123:458" style="position: absolute; left: 40px; top: 100px; width: 120px; height: 40px; background-color: rgb(0, 119, 255); border-radius: 4px;"></div>
</div>
```

## JSON输出示例

```json
{
  "id": "123:456",
  "name": "主页面",
  "type": "FRAME",
  "style": {
    "position": "absolute",
    "left": "0px",
    "top": "0px",
    "width": "1440px",
    "height": "900px",
    "backgroundColor": "rgb(255, 255, 255)"
  },
  "className": "figma-frame-main-page-12345678",
  "width": 1440,
  "height": 900,
  "children": [
    {
      "id": "123:457",
      "name": "标题",
      "type": "TEXT",
      "style": {
        "position": "absolute",
        "left": "40px",
        "top": "40px",
        "fontSize": "24px",
        "fontFamily": "'Inter', sans-serif",
        "fontWeight": "700",
        "color": "rgb(0, 0, 0)"
      },
      "className": "figma-text-title-87654321",
      "characters": "Hello World"
    },
    {
      "id": "123:458",
      "name": "按钮",
      "type": "RECTANGLE",
      "style": {
        "position": "absolute",
        "left": "40px",
        "top": "100px",
        "width": "120px",
        "height": "40px",
        "backgroundColor": "rgb(0, 119, 255)",
        "borderRadius": "4px"
      },
      "className": "figma-rectangle-button-abcdef12",
      "width": 120,
      "height": 40
    }
  ]
}
```

## 注意事项

1. 解析大型设计稿可能需要一些时间
2. 某些复杂的效果（如混合模式、蒙版等）可能无法完全还原
3. 图片会转换为base64格式，可能会增加输出文件的大小
4. 字体需要在目标环境中可用，否则可能会使用默认字体

## 扩展和自定义

如果需要支持更多节点类型或自定义解析逻辑，可以通过以下步骤扩展：

1. 在`parsers`目录下创建新的解析器类
2. 继承`BaseNodeParser`类并实现`parseSpecificProps`方法
3. 在`base.ts`的`createParserByNodeType`函数中添加新的节点类型处理
