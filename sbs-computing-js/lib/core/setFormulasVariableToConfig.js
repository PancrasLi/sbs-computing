import getFormulasVariable from "./getFormulasVariable";
import { validateFormula } from "./getFormulasVariable";

/**
 * 设置配置对象的公式变量
 * @param {Object} config - 配置对象
 * @returns {Object} 处理后的配置对象
 */
function setFormulasVariableToConfig(config) {
    try {
        Object.entries(config).forEach(([key, field]) => {
            // 获取公式变量
            field.__variable__ = getFormulasVariable(field);
            
            // 如果有公式，验证公式语法
            if (field.eqn) {
                if (!validateFormula(field.eqn)) {
                    console.warn(`字段 ${key} 的公式语法无效: ${field.eqn}`);
                }
            }
        });
        
        // 验证依赖关系
        validateDependencies(config);
        
        return config;
    } catch (error) {
        console.error('设置公式变量失败:', error);
        throw error;
    }
}

/**
 * 验证配置对象的依赖关系
 * @param {Object} config - 配置对象
 */
function validateDependencies(config) {
    const graph = new Map();
    const fields = Object.keys(config);
    
    // 构建依赖图
    fields.forEach(field => {
        const variables = config[field].__variable__ || [];
        graph.set(field, variables);
    });
    
    // 检查循环依赖
    const visited = new Set();
    const visiting = new Set();
    
    function checkCycle(field) {
        if (visiting.has(field)) {
            const cycle = Array.from(visiting).join(' -> ') + ` -> ${field}`;
            throw new Error(`检测到循环依赖: ${cycle}`);
        }
        if (visited.has(field)) return;
        
        visiting.add(field);
        const dependencies = graph.get(field) || [];
        dependencies.forEach(dep => {
            if (fields.includes(dep)) {
                checkCycle(dep);
            }
        });
        visiting.delete(field);
        visited.add(field);
    }
    
    // 对每个字段检查循环依赖
    fields.forEach(field => {
        if (!visited.has(field)) {
            checkCycle(field);
        }
    });
}

export { setFormulasVariableToConfig };