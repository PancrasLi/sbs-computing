import sbs from "./init"
import { reactive } from "./core/reactive"
import { validateNumberRange, formatNumber } from "./utils"
import { ComputingDebugger } from './utils/debugger'
import { BrowserDebugger } from './utils/browser-debugger'

export { sbs, reactive }

/**
 * @typedef {Object} ValidationRule
 * @property {number} [min] - 最小值
 * @property {number} [max] - 最大值
 * @property {number} [precision] - 精度
 * @property {Function} [custom] - 自定义验证函数
 */

/**
 * @typedef {Object} ComputingField
 * @property {number} value - 字段值
 * @property {string} eqn - 计算公式
 * @property {Function} computeHandler - 计算处理函数
 * @property {string[]} [dependencies] - 依赖的字段列表
 * @property {string} [unit] - 单位
 * @property {number} [precision] - 精度
 * @property {ValidationRule} [validation] - 验证规则
 * @property {string} [description] - 字段描述
 */

/**
 * 工具函数：四舍五入到指定精度
 * @param {number} value - 需要处理的值
 * @param {number} precision - 精度
 * @returns {number}
 */
const roundToPrecision = (value, precision = 2) => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

// 创建调试器实例
const debugInstance = new ComputingDebugger();

// 初始化浏览器调试工具
const browserDebugger = new BrowserDebugger();

// 修改 computingConfig 的定义，添加调试支持
const computingConfig = reactive({
  // 基础输入值
  a: {
    value: 100,
    eqn: '',
    unit: '个',
    precision: 0,
    computeHandler() {
      return this.value;
    }
  },
  
  // 单价
  price: {
    value: 5.99,
    eqn: '',
    unit: '元',
    precision: 2,
    computeHandler() {
      return this.value;
    }
  },
  
  // 总价 = 数量 * 单价
  totalPrice: {
    value: 0,
    eqn: 'a * price',
    unit: '元',
    precision: 2,
    dependencies: ['a', 'price'],
    computeHandler() {
      // 创建计算前快照
      debugInstance.createSnapshot(`totalPrice_before_${Date.now()}`, {
        a: computingConfig.a.value,
        price: computingConfig.price.value
      });

      // 记录计算过程
      debugInstance.log('compute', '开始计算 totalPrice', {
        a: computingConfig.a.value,
        price: computingConfig.price.value
      });

      // 检查断点
      if (debugInstance.breakpoints.has('totalPrice')) {
        debugInstance.log('breakpoint', '触发断点: totalPrice');
        // 这里可以添加断点处理逻辑
      }

      const result = roundToPrecision(
        computingConfig.a.value * computingConfig.price.value,
        this.precision
      );

      // 创建计算后快照
      debugInstance.createSnapshot(`totalPrice_after_${Date.now()}`, {
        result,
        inputs: {
          a: computingConfig.a.value,
          price: computingConfig.price.value
        }
      });

      // 在计算过程中更新调试面板
      browserDebugger.updatePanel({
        field: 'totalPrice',
        value: result,
        inputs: {
          a: computingConfig.a.value,
          price: computingConfig.price.value
        }
      });

      return result;
    }
  },
  
  // 折扣率
  discount: {
    value: 0.9,
    eqn: '',
    unit: '%',
    precision: 2,
    computeHandler() {
      return this.value;
    }
  },
  
  // 最终价格 = 总价 * 折扣
  finalPrice: {
    value: 0,
    eqn: 'totalPrice * discount',
    unit: '元',
    precision: 2,
    dependencies: ['totalPrice', 'discount'],
    computeHandler() {
      return roundToPrecision(
        computingConfig.totalPrice.value * computingConfig.discount.value,
        this.precision
      );
    }
  }
});

// 添加字段验证
function validateField(field, value) {
    if (!field.validation) return true;
    
    const { min, max, precision, custom } = field.validation;
    
    if (!validateNumberRange(value, { min, max, precision })) {
        return false;
    }
    
    if (custom && typeof custom === 'function') {
        return custom(value);
    }
    
    return true;
}

// 增强的结果格式化
function formatResult(result) {
    return Object.entries(result)
        .map(([key, field]) => {
            const formatted = typeof field.value === 'number'
                ? formatNumber(field.value, {
                    precision: field.precision,
                    unit: field.unit,
                    thousandsSeparator: true
                })
                : field.value;
            
            return `${key}${field.description ? ` (${field.description})` : ''}: ${formatted}`;
        })
        .join('\n');
}

// 初始化配置
sbs.init(computingConfig, (result) => {
    console.log('计算更新:\n', formatResult(result));
});

// 成功回调
sbs.success = (result) => {
    console.log('计算成功:\n', formatResult(result));
};

// 错误处理
sbs.error = (error) => {
    console.error('计算错误:', error);
};

// 使用示例
// 修改商品数量
computingConfig.a.value = 200;

// 修改单价
computingConfig.price.value = 6.99;

// 修改折扣
computingConfig.discount.value = 0.8;

// 配置示例
const config = reactive({
    quantity: {
        value: 100,
        eqn: '',
        unit: '个',
        precision: 0,
        description: '数量',
        validation: {
            min: 0,
            max: 1000,
            precision: 0
        },
        computeHandler() {
            return this.value;
        }
    },
    
    unitPrice: {
        value: 5.99,
        eqn: '',
        unit: '元',
        precision: 2,
        description: '单价',
        validation: {
            min: 0,
            precision: 2
        },
        computeHandler() {
            return this.value;
        }
    },
    
    // ... 其他配置
});

// 使用示例
config.quantity.value = 200;  // 会触发相关计算和验证

// 添加调试相关的辅助函数
function enableDebugging() {
    debugInstance.enable();
}

function disableDebugging() {
    debugInstance.disable();
}

function inspectField(fieldKey) {
    const field = computingConfig[fieldKey];
    console.log(`字段 ${fieldKey} 的当前状态:`, {
        value: field.value,
        eqn: field.eqn,
        dependencies: field.dependencies,
        unit: field.unit,
        precision: field.precision
    });
}

// 导出调试相关函数和配置
export {
    enableDebugging,
    disableDebugging,
    inspectField,
    computingConfig,
    debugInstance
};

// 完整调试流程
enableDebugging();  // 启用调试

// 设置要监控的字段
debugInstance.setBreakpoint('totalPrice');
debugInstance.setBreakpoint('finalPrice');

// 记录初始状态
debugInstance.createSnapshot('初始状态', computingConfig);

// 修改数据
computingConfig.a.value = 500;      // 修改数量
computingConfig.price.value = 9.99;  // 修改单价
computingConfig.discount.value = 0.8; // 修改折扣

// 记录最终状态
debugInstance.createSnapshot('最终状态', computingConfig);

// 查看变化
debugInstance.compareSnapshots('初始状态', '最终状态');

// 查看日志
console.log(debugInstance.logs);


