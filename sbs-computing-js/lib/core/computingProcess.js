import { reactive, setChangeCallback } from './reactive.js';

/**
 * 初始化配置数据
 * @param {Object} config - 原始配置对象
 * @returns {Object} 处理后的响应式配置对象
 */
function initConfigData(config) {
    const processedConfig = reactive({});
    
    // 处理每个字段
    Object.entries(config).forEach(([key, field]) => {
        processedConfig[key] = {
            value: field.value,
            eqn: field.eqn,
            __variable__: [],  // 存储依赖的变量
            __computed__: false  // 标记是否已计算
        };
    });

    // 解析公式中的变量依赖
    Object.entries(processedConfig).forEach(([key, field]) => {
        if (field.eqn) {
            field.__variable__ = extractVariables(field.eqn);
        }
    });

    return processedConfig;
}

/**
 * 从公式中提取变量
 * @param {string} formula - 公式字符串
 * @returns {string[]} 变量列表
 */
function extractVariables(formula) {
    // 简单的变量提取逻辑
    const variables = formula.match(/[a-zA-Z_]\w*/g) || [];
    return [...new Set(variables)].filter(v => !isOperator(v));
}

/**
 * 检查是否是操作符或函数名
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是操作符
 */
function isOperator(str) {
    const operators = [
        'sin', 'cos', 'tan', 'sqrt', 'pow',
        'abs', 'round', 'floor', 'ceil',
        'min', 'max'
    ];
    return operators.includes(str);
}

/**
 * 计算处理器
 * @param {Object} config - 配置对象
 * @param {Function} callback - 计算完成回调
 */
function computingProcess(config, callback) {
    const computeQueue = [];
    const computed = new Set();

    // 构建计算队列
    Object.entries(config).forEach(([key, field]) => {
        if (field.eqn && !field.__computed__) {
            computeQueue.push(key);
        }
    });

    // 处理计算队列
    while (computeQueue.length > 0) {
        const key = computeQueue.shift();
        const field = config[key];

        // 检查依赖是否都已计算
        const canCompute = field.__variable__.every(dep => 
            !config[dep]?.eqn || computed.has(dep)
        );

        if (canCompute) {
            try {
                // 计算字段值
                field.value = evaluateFormula(field.eqn, config);
                field.__computed__ = true;
                computed.add(key);
            } catch (error) {
                console.error(`Error computing ${key}:`, error);
            }
        } else {
            // 依赖未就绪，放回队列末尾
            computeQueue.push(key);
        }

        // 防止循环依赖导致的死循环
        if (computeQueue.length > 1000) {
            throw new Error('Possible circular dependency detected');
        }
    }

    // 调用回调
    if (callback) {
        callback(config);
    }
}

/**
 * 计算公式
 * @param {string} formula - 公式字符串
 * @param {Object} config - 配置对象
 * @returns {number} 计算结果
 */
function evaluateFormula(formula, config) {
    // 替换变量为实际值
    const evalFormula = formula.replace(/[a-zA-Z_]\w*/g, match => {
        if (isOperator(match)) return match;
        if (!(match in config)) throw new Error(`Variable ${match} not found`);
        return config[match].value;
    });

    // 使用 Function 构造函数创建安全的计算环境
    const mathFunctions = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        sqrt: Math.sqrt,
        pow: Math.pow,
        abs: Math.abs,
        round: Math.round,
        floor: Math.floor,
        ceil: Math.ceil,
        min: Math.min,
        max: Math.max
    };

    const fn = new Function(...Object.keys(mathFunctions), `return ${evalFormula};`);
    return fn(...Object.values(mathFunctions));
}

/**
 * 处理配置变更的回调函数
 * @param {string} key - 变更的配置键
 * @param {*} value - 新的值
 * @param {Object} target - 目标对象
 */
function changeObCallbackHandle(key, value, target) {
    if (!target || !target.fkey) return;
    
    // 使用 requestAnimationFrame 优化性能
    requestAnimationFrame(() => {
        computingProcess(target, (config) => {
            // 在这里可以添加计算完成后的回调逻辑
            console.log(`Computation completed for ${key}`);
        });
    });
}

// 设置响应式系统的变更回调
setChangeCallback(changeObCallbackHandle);

// 导出所需的函数
export { initConfigData, computingProcess };