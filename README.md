# SBS Computing

A powerful reactive computing framework that supports field dependency calculations, data validation, and real-time debugging.

[![npm version](https://badge.fury.io/js/sbs-computing-js.svg)](https://www.npmjs.com/package/sbs-computing-js)
[![Downloads](https://img.shields.io/npm/dm/sbs-computing-js.svg)](https://www.npmjs.com/package/sbs-computing-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 Reactive Data Processing
- 📊 Automatic Dependency Tracking and Computation
- ✅ Data Validation
- 🔍 Real-time Debugging Tools
- 📝 Computation Process Snapshots
- 📈 Performance Monitoring

## Installation

### Using NPM
```bash
npm install sbs-computing-js
```

### Using PNPM
```bash
pnpm add sbs-computing-js
```

### Using YARN
```bash
yarn add sbs-computing-js
```

### Using CDN
```html
<!-- ESM -->
<script type="module">
  import { reactive, sbs } from 'https://unpkg.com/sbs-computing-js/dist/index.mjs'
</script>

<!-- UMD -->
<script src="https://unpkg.com/sbs-computing-js/dist/index.umd.js"></script>
```

## Usage Guide

### Basic Usage
```javascript
import { reactive, sbs } from 'sbs-computing-js';

// Create reactive configuration
const config = reactive({
  quantity: {
    value: 100,
    eqn: '',
    unit: 'pcs'
  },
  price: {
    value: 5.99,
    eqn: '',
    unit: 'USD'
  },
  total: {
    value: 0,
    eqn: 'quantity * price',
    unit: 'USD',
    dependencies: ['quantity', 'price'],
    computeHandler() {
      return this.quantity.value * this.price.value;
    }
  }
});

// Initialize
sbs.init(config, (result) => {
  console.log('Computation Update:', result);
});
```

### Advanced Features

#### 1. Data Validation
```javascript
const config = reactive({
  quantity: {
    value: 100,
    validation: {
      min: 0,
      max: 1000,
      precision: 0,
      custom: (value) => value % 2 === 0 // Custom validation: must be even
    }
  }
});
```

#### 2. Format Output
```javascript
const config = reactive({
  price: {
    value: 1234.5678,
    unit: 'USD',
    precision: 2,
    format: {
      thousandsSeparator: true, // Enable thousands separator
      currency: 'USD'           // Currency format
    }
  }
});
```

#### 3. Complex Dependency Calculations
```javascript
const config = reactive({
  basePrice: { value: 100 },
  taxRate: { value: 0.13 },
  discount: { value: 0.8 },
  
  // Final price = (base price + tax) * discount
  finalPrice: {
    dependencies: ['basePrice', 'taxRate', 'discount'],
    computeHandler() {
      const tax = this.basePrice.value * this.taxRate.value;
      return (this.basePrice.value + tax) * this.discount.value;
    }
  }
});
```

## Debugging Features

### 1. Enable Debugging
```javascript
import { enableDebugging } from 'sbs-computing-js';

enableDebugging();
```

### 2. Monitor Fields
```javascript
import { debugInstance } from 'sbs-computing-js';

// Set breakpoint
debugInstance.setBreakpoint('total');

// Create snapshot
debugInstance.createSnapshot('Initial State', config);

// Modify value
config.quantity.value = 200;

// Compare changes
debugInstance.compareSnapshots('Initial State', 'Current State');
```

### 3. Using Debug Page

Start development server:
```bash
npm run dev
```

Access debug pages:
- Main page: `http://localhost:3000/`
- Debug page: `http://localhost:3000/debug.html`

## API Documentation

### reactive(target)
Creates a reactive object.

### ComputingField
Computing field configuration:
- `value`: Field value
- `eqn`: Calculation formula
- `unit`: Unit
- `precision`: Precision
- `dependencies`: Dependent fields
- `computeHandler`: Computation handler function
- `validation`: Validation rules

### Debug Tools
- `enableDebugging()`: Enable debugging
- `disableDebugging()`: Disable debugging
- `inspectField(fieldKey)`: Inspect field status
- `createSnapshot(id, data)`: Create data snapshot
- `compareSnapshots(id1, id2)`: Compare snapshots

## Development

1. Clone repository
```bash
git clone https://github.com/your-username/sbs-computing.git
```

2. Install dependencies
```bash
cd sbs-computing
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build
```bash
npm run build
```

## License

MIT

---

# SBS Computing (中文文档)

一个强大的响应式计算框架，支持字段间依赖计算、数据验证和实时调试。

## 特性

- 🔄 响应式数据处理
- 📊 自动依赖追踪和计算
- ✅ 数据验证
- 🔍 实时调试工具
- 📝 计算过程快照
- 📈 性能监控

## 安装

### 使用 NPM
```bash
npm install sbs-computing-js
```

### 使用 PNPM
```bash
pnpm add sbs-computing-js
```

### 使用 YARN
```bash
yarn add sbs-computing-js
```

### 使用 CDN
```html
<!-- ESM -->
<script type="module">
  import { reactive, sbs } from 'https://unpkg.com/sbs-computing-js/dist/index.mjs'
</script>

<!-- UMD -->
<script src="https://unpkg.com/sbs-computing-js/dist/index.umd.js"></script>
```

## 使用指南

### 基础使用
```javascript
import { reactive, sbs } from 'sbs-computing-js';

// 创建响应式配置
const config = reactive({
  quantity: {
    value: 100,
    eqn: '',
    unit: '个'
  },
  price: {
    value: 5.99,
    eqn: '',
    unit: '元'
  },
  total: {
    value: 0,
    eqn: 'quantity * price',
    unit: '元',
    dependencies: ['quantity', 'price'],
    computeHandler() {
      return this.quantity.value * this.price.value;
    }
  }
});

// 初始化
sbs.init(config, (result) => {
  console.log('计算更新:', result);
});
```

### 高级功能

#### 1. 数据验证
```javascript
const config = reactive({
  quantity: {
    value: 100,
    validation: {
      min: 0,
      max: 1000,
      precision: 0,
      custom: (value) => value % 2 === 0 // 自定义验证：必须是偶数
    }
  }
});
```

#### 2. 格式化输出
```javascript
const config = reactive({
  price: {
    value: 1234.5678,
    unit: '元',
    precision: 2,
    format: {
      thousandsSeparator: true, // 启用千分位
      currency: 'CNY'           // 货币格式
    }
  }
});
```

#### 3. 复杂依赖计算
```javascript
const config = reactive({
  basePrice: { value: 100 },
  taxRate: { value: 0.13 },
  discount: { value: 0.8 },
  
  // 最终价格 = (基础价格 + 税) * 折扣
  finalPrice: {
    dependencies: ['basePrice', 'taxRate', 'discount'],
    computeHandler() {
      const tax = this.basePrice.value * this.taxRate.value;
      return (this.basePrice.value + tax) * this.discount.value;
    }
  }
});
```

## 调试功能

### 1. 启用调试
```javascript
import { enableDebugging } from 'sbs-computing-js';

enableDebugging();
```

### 2. 监控字段
```javascript
import { debugInstance } from 'sbs-computing-js';

// 设置断点
debugInstance.setBreakpoint('total');

// 创建快照
debugInstance.createSnapshot('初始状态', config);

// 修改值
config.quantity.value = 200;

// 比较变化
debugInstance.compareSnapshots('初始状态', '当前状态');
```

### 3. 使用调试页面

启动开发服务器：
```bash
npm run dev
```

访问调试页面：
- 主页面：`http://localhost:3000/`
- 调试页面：`http://localhost:3000/debug.html`

## API 文档

### reactive(target)
创建响应式对象。

### ComputingField
计算字段配置：
- `value`: 字段值
- `eqn`: 计算公式
- `unit`: 单位
- `precision`: 精度
- `dependencies`: 依赖字段
- `computeHandler`: 计算处理函数
- `validation`: 验证规则

### 调试工具
- `enableDebugging()`: 启用调试
- `disableDebugging()`: 禁用调试
- `inspectField(fieldKey)`: 检查字段状态
- `createSnapshot(id, data)`: 创建数据快照
- `compareSnapshots(id1, id2)`: 比较快照

## 开发

1. 克隆仓库
```bash
git clone https://github.com/your-username/sbs-computing.git
```

2. 安装依赖
```bash
cd sbs-computing
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建
```bash
npm run build
```

## 许可证

MIT