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
  
export { isPlainObject,debounce,deepClone}