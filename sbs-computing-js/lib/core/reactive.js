import { isPlainObject } from '../utils';
import { changeObCallbackHandle } from '../core/computingProcess'
function reactive(target,key) {
    if (!isPlainObject(target)) {
        return target;
    }
    // 创建响应式对象
    const observed = new Proxy(target, {
        get(target, key, receiver) {
          
            if (isPlainObject(target[key])) {
                target[key]['fkey'] = target['fkey'] ? target['fkey'] : key;
                return reactive(target[key])
            }
            
            const res = Reflect.get(target, key, receiver);
            return res;
        },
        set(target, key, value, receiver) {
            if (isPlainObject(value)) {
                return reactive(value,key)
            }
            const res = Reflect.set(target, key, value, receiver);
            changeObCallbackHandle(key, value, target)
            return res;
        }

    });
    return observed;
}
export { reactive };