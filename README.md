# SBS Computing

A lightweight reactive computing framework for JavaScript that provides reactive data processing and formula-based calculations.

[![npm version](https://badge.fury.io/js/sbs-computing-js.svg)](https://www.npmjs.com/package/sbs-computing-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 Reactive Data Processing
- 📊 Formula-based Calculations
- 🔍 Variable Tracking
- 📝 TypeScript Support

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

## Usage Guide

### Basic Usage
```javascript
import { reactive, sbs } from 'sbs-computing-js';

// Create reactive configuration
const config = reactive({
  price: {
    value: 100
  },
  quantity: {
    value: 5
  },
  discount: {
    value: 10
  },
  subtotal: {
    eqn: 'price * quantity'
  },
  total: {
    eqn: 'subtotal * (1 - discount / 100)'
  }
});

// Initialize
sbs.init(config, (result) => {
  console.log('Computation Update:', result);
});
```

### Core Features

#### 1. Reactive Data
```javascript
import { reactive, sbs } from 'sbs-computing-js';

const data = reactive({
  count: {
    value: 0
  },
  doubled: {
    eqn: 'count * 2'
  }
});

sbs.init(data);
```

#### 2. Formula-based Calculations
```javascript
const config = reactive({
  basePrice: {
    value: 100
  },
  taxRate: {
    value: 0.13
  },
  finalPrice: {
    eqn: 'basePrice * (1 + taxRate)'
  }
});

sbs.init(config);
```

## API Documentation

### Core Functions

#### reactive(target)
Creates a reactive object that tracks dependencies and updates automatically.

#### sbs.init(config, callback?)
Initializes the reactive computation system with the given configuration and optional callback.

#### getFormulasVariable(formula)
Extracts variables from a formula string.

#### setFormulasVariableToConfig(config, variables)
Sets formula variables in the configuration.

## Development

1. Clone repository
```bash
git clone https://github.com/pancrasli/sbs-computing.git
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

一个轻量级的响应式计算框架，提供响应式数据处理和基于公式的计算功能。

## 特性

- 🔄 响应式数据处理
- 📊 基于公式的计算
- 🔍 变量追踪
- 📝 TypeScript 支持

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

## 使用指南

### 基础使用
```javascript
import { reactive, sbs } from 'sbs-computing-js';

// 创建响应式配置
const config = reactive({
  price: {
    value: 100
  },
  quantity: {
    value: 5
  },
  discount: {
    value: 10
  },
  subtotal: {
    eqn: 'price * quantity'
  },
  total: {
    eqn: 'subtotal * (1 - discount / 100)'
  }
});

// 初始化
sbs.init(config, (result) => {
  console.log('计算更新:', result);
});
```

### 核心功能

#### 1. 响应式数据
```javascript
import { reactive, sbs } from 'sbs-computing-js';

const data = reactive({
  count: {
    value: 0
  },
  doubled: {
    eqn: 'count * 2'
  }
});

sbs.init(data);
```

#### 2. 基于公式的计算
```javascript
const config = reactive({
  basePrice: {
    value: 100
  },
  taxRate: {
    value: 0.13
  },
  finalPrice: {
    eqn: 'basePrice * (1 + taxRate)'
  }
});

sbs.init(config);
```

## API 文档

### 核心函数

#### reactive(target)
创建一个响应式对象，自动追踪依赖并更新。

#### sbs.init(config, callback?)
初始化响应式计算系统，接收配置对象和可选的回调函数。

#### getFormulasVariable(formula)
从公式字符串中提取变量。

#### setFormulasVariableToConfig(config, variables)
在配置中设置公式变量。

## 开发

1. 克隆仓库
```bash
git clone https://github.com/pancrasli/sbs-computing.git
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