// 判断是否对象
const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

// 防抖
var timer;
function debounce(fn, delay) {
    clearTimeout(timer);
    timer = setTimeout(function () {
        fn();
    }, delay);
}

// 深拷贝
/**
 * @param {*} target 需要被拷贝的对象
 * @param {*} hash   性能考虑不用 Map，使用弱引用的 WeakMap
 * @returns
 */
function deepClone(target, hash = new WeakMap) {
    // null 和 undefiend 是不需要拷贝的
    if (target == null) { return target; }
    // RegExp 和 Date 这两种特殊值暂不考虑
    if (target instanceof RegExp) { return new RegExp(target) }
    if (target instanceof Date) { return new Date(target) }
    // 基本数据类型直接返回即可，函数暂不考虑
    if (typeof target != 'object') return target;
    // 针对 [] {} 两种类型，基于它们的构造函数来实例化一个新的对象实例
    let clonedTarget = new target.constructor();
    // 说明是一个已经拷贝过的对象，那么直接返回即可，防止循环引用
    if (hash.get(target)) {
      return hash.get(target)
    }
    // 记录下已经拷贝过的对象
    hash.set(target, clonedTarget);
    // 遍历对象的 key，in 会遍历当前对象上的属性 和 __proto__ 指向的属性
    for (let key in target) {
      // 如果 key 是对象自有的属性
      if (target.hasOwnProperty(key)) {
        // 如果值依然是对象，就继续递归拷贝
        clonedTarget[key] = deepClone(target[key], hash);
      }
    }
    return clonedTarget
  }
  
/**
 * 验证数值范围
 * @param {number} value - 要验证的值
 * @param {Object} options - 验证选项
 * @returns {boolean}
 */
export function validateNumberRange(value, { min, max, precision } = {}) {
    if (typeof value !== 'number') return false;
    if (min != null && value < min) return false;
    if (max != null && value > max) return false;
    if (precision != null) {
        const factor = Math.pow(10, precision);
        return Math.round(value * factor) === value * factor;
    }
    return true;
}

/**
 * 格式化数值
 * @param {number} value - 要格式化的值
 * @param {Object} options - 格式化选项
 * @returns {string}
 */
export function formatNumber(value, { precision = 2, unit = '', thousandsSeparator = true } = {}) {
    if (typeof value !== 'number') return String(value);
    
    let formatted = value.toFixed(precision);
    
    if (thousandsSeparator) {
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formatted = parts.join('.');
    }
    
    return `${formatted}${unit}`;
}

export { isPlainObject,debounce,deepClone}