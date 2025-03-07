import { isPlainObject } from '../utils';

// 依赖收集
const targetMap = new WeakMap();
const effectStack = [];

// 存储回调函数
let changeCallback = null;

/**
 * 设置变更回调函数
 * @param {Function} callback - 回调函数
 */
export function setChangeCallback(callback) {
    changeCallback = callback;
}

/**
 * 创建响应式对象
 * @template T
 * @param {T} target - 目标对象
 * @param {string} [key] - 字段键名
 * @returns {T} - 响应式对象
 */
function reactive(target, key) {
    if (!isPlainObject(target)) {
        return target;
    }

    // 如果已经是响应式对象，直接返回
    if (target.__isReactive) {
        return target;
    }

    const handler = {
        get(target, key, receiver) {
            // 记录访问的属性
            track(target, key);
            
            const value = Reflect.get(target, key, receiver);
            
            if (isPlainObject(value)) {
                // 设置父级字段名
                value.fkey = target.fkey || key;
                return reactive(value);
            }
            
            return value;
        },

        set(target, key, value, receiver) {
            const oldValue = target[key];
            
            // 如果是对象，创建响应式
            if (isPlainObject(value)) {
                value = reactive(value, key);
            }

            const result = Reflect.set(target, key, value, receiver);
            
            // 只在值真正改变时触发更新
            if (oldValue !== value) {
                trigger(target, key, value);
            }
            
            return result;
        },

        // 拦截 Object.keys 等操作
        ownKeys(target) {
            track(target, 'iterate');
            return Reflect.ownKeys(target);
        },

        // 拦截属性删除
        deleteProperty(target, key) {
            const hadKey = Object.prototype.hasOwnProperty.call(target, key);
            const result = Reflect.deleteProperty(target, key);
            
            if (hadKey && result) {
                trigger(target, key, undefined);
            }
            
            return result;
        }
    };

    const observed = new Proxy(target, handler);
    
    // 标记为响应式对象
    Object.defineProperty(observed, '__isReactive', {
        value: true,
        enumerable: false,
        configurable: false
    });

    return observed;
}

/**
 * 依赖收集
 * @param {object} target - 目标对象
 * @param {string|symbol} key - 属性键
 */
function track(target, key) {
    if (effectStack.length === 0) {
        return;
    }

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    const effect = effectStack[effectStack.length - 1];
    if (!dep.has(effect)) {
        dep.add(effect);
        effect.deps.push(dep);
    }
}

/**
 * 触发更新
 * @param {object} target - 目标对象
 * @param {string|symbol} key - 属性键
 * @param {*} value - 新值
 */
function trigger(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }

    const effects = new Set();
    
    // 添加相关依赖
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => effects.add(effect));
        }
    };

    // 处理数组长度变化
    if (key === 'length' && Array.isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= value) {
                add(dep);
            }
        });
    } else {
        add(depsMap.get(key));
        
        // 处理迭代器相关的依赖
        if (key === 'iterate') {
            add(depsMap.get('iterate'));
        }
    }

    effects.forEach(effect => {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect();
        }
    });

    // 触发变更回调
    if (changeCallback) {
        changeCallback(key, value, target);
    }
}

export { reactive };