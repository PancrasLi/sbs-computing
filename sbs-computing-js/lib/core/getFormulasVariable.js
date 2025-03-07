/**
 * 数学运算符和函数名
 */
const OPERATORS = [
    'plus', 'minus', 'multiply', 'divide',
    'sin', 'cos', 'tan', 'sqrt', 'pow',
    'abs', 'round', 'floor', 'ceil'
];

const SYMBOLS = ['+', '-', '*', '/', '(', ')'];

/**
 * 从公式中提取变量
 * @param {object|string} formulas - 公式对象或字符串
 * @returns {string[]} 变量列表
 */
function getFormulasVariable(formulas) {
    try {
        // 确保 formula 是字符串类型
        let formulaStr = '';
        
        if (typeof formulas === 'string') {
            formulaStr = formulas;
        } else if (formulas && typeof formulas === 'object') {
            formulaStr = formulas.eqn || '';
        }

        // 如果公式为空，返回空数组
        if (!formulaStr) {
            return [];
        }

        // 创建正则表达式匹配所有运算符、函数和数字
        const operatorPattern = OPERATORS.map(op => `\\b${op}\\b`).join('|');
        const symbolPattern = `[${SYMBOLS.map(s => `\\${s}`).join('')}]`;
        const pattern = new RegExp(
            `(${operatorPattern})|\\d+(\\.\\d+)?|${symbolPattern}|\\s+`,
            'g'
        );

        // 分割公式并过滤
        const parts = String(formulaStr).split(pattern);
        
        return parts
            .map(item => item?.trim())
            .filter(item => {
                return item && 
                       !OPERATORS.includes(item) &&
                       !SYMBOLS.includes(item) && 
                       !/^\d+(\.\d+)?$/.test(item) &&
                       !/^\s*$/.test(item);
            });
    } catch (error) {
        console.error('解析公式变量失败:', error);
        return [];
    }
}

/**
 * 验证公式语法
 * @param {string} formula - 公式字符串
 * @returns {boolean} 是否有效
 */
function validateFormula(formula) {
    try {
        // 确保输入是字符串
        if (!formula || typeof formula !== 'string') {
            return false;
        }

        // 检查括号匹配
        let brackets = 0;
        for (const char of formula) {
            if (char === '(') brackets++;
            if (char === ')') brackets--;
            if (brackets < 0) return false;
        }
        if (brackets !== 0) return false;

        // 检查运算符使用
        const operators = formula.match(/[+\-*/]/g) || [];
        const hasConsecutiveOperators = /[+\-*/]{2,}/.test(formula);
        if (hasConsecutiveOperators) return false;

        // 检查函数调用格式
        const functionCalls = formula.match(/\w+\s*\(/g) || [];
        for (const func of functionCalls) {
            const funcName = func.replace(/[(\s]/g, '');
            if (!OPERATORS.includes(funcName)) return false;
        }

        return true;
    } catch (error) {
        console.error('公式验证失败:', error);
        return false;
    }
}

// 导出默认函数和命名函数
export { validateFormula };
export default getFormulasVariable;