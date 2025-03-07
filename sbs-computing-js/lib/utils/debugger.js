export class ComputingDebugger {
    constructor() {
        this.isDebugMode = false;
        this.logs = [];
        this.snapshots = new Map();
        this.breakpoints = new Set();
    }

    enable() {
        this.isDebugMode = true;
        console.log('调试模式已启用');
    }

    disable() {
        this.isDebugMode = false;
        console.log('调试模式已禁用');
    }

    log(type, message, data = {}) {
        if (!this.isDebugMode) return;

        const logEntry = {
            timestamp: new Date(),
            type,
            message,
            data
        };

        this.logs.push(logEntry);
        console.log(`[${type}] ${message}`, data);
    }

    createSnapshot(id, data) {
        this.snapshots.set(id, {
            timestamp: new Date(),
            data: JSON.parse(JSON.stringify(data))
        });
    }

    compareSnapshots(id1, id2) {
        const snapshot1 = this.snapshots.get(id1);
        const snapshot2 = this.snapshots.get(id2);

        if (!snapshot1 || !snapshot2) {
            console.error('快照不存在');
            return;
        }

        console.log('快照比较结果：');
        this.deepCompare(snapshot1.data, snapshot2.data);
    }

    deepCompare(obj1, obj2, path = '') {
        const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

        allKeys.forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (typeof val1 === 'object' && typeof val2 === 'object') {
                this.deepCompare(val1, val2, currentPath);
            } else if (val1 !== val2) {
                console.log(`${currentPath}: ${val1} -> ${val2}`);
            }
        });
    }

    clear() {
        this.logs = [];
        this.snapshots.clear();
        this.breakpoints.clear();
        console.log('已清除所有调试信息');
    }
} 