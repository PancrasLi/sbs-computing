import { BrowserDebugger } from './browserDebugger';

/**
 * 调试类
 */
class Debug {
    constructor() {
        this.isEnabled = false;
        this.browserDebugger = null;
        this.logs = [];
        this.maxLogs = 1000;
        this.breakpoints = new Map();
        this.computeSteps = [];
    }

    /**
     * 启用调试
     */
    enable() {
        if (this.isEnabled) return;
        
        this.isEnabled = true;
        
        // 在浏览器环境中初始化调试器
        if (typeof window !== 'undefined' && !this.browserDebugger) {
            this.browserDebugger = new BrowserDebugger();
            this.browserDebugger.toggle(); // 显示调试面板
        }
        
        this.log('Debug mode enabled', 'info');
    }

    /**
     * 禁用调试
     */
    disable() {
        if (!this.isEnabled) return;
        
        this.isEnabled = false;
        if (this.browserDebugger) {
            this.browserDebugger.toggle();
            this.browserDebugger = null;
        }
        this.log('Debug mode disabled', 'info');
    }

    /**
     * 设置断点
     * @param {string} fieldName - 字段名称
     * @param {Function} condition - 断点条件函数
     */
    setBreakpoint(fieldName, condition = null) {
        if (!this.isEnabled) {
            console.warn('Debug mode is not enabled');
            return;
        }

        this.breakpoints.set(fieldName, {
            condition,
            enabled: true,
            hitCount: 0
        });

        this.log(`Breakpoint set for field: ${fieldName}`, 'info');
        
        if (this.browserDebugger) {
            this.browserDebugger.addBreakpoint(fieldName, condition);
        }
    }

    /**
     * 移除断点
     * @param {string} fieldName - 字段名称
     */
    removeBreakpoint(fieldName) {
        if (this.breakpoints.delete(fieldName)) {
            this.log(`Breakpoint removed for field: ${fieldName}`, 'info');
            
            if (this.browserDebugger) {
                this.browserDebugger.removeBreakpoint(fieldName);
            }
        }
    }

    /**
     * 检查断点
     * @param {string} fieldName - 字段名称
     * @param {*} value - 当前值
     * @returns {boolean} 是否触发断点
     */
    checkBreakpoint(fieldName, value) {
        const bp = this.breakpoints.get(fieldName);
        if (!bp || !bp.enabled) return false;

        bp.hitCount++;
        
        if (bp.condition) {
            try {
                return bp.condition(value);
            } catch (error) {
                this.error(`Error in breakpoint condition for ${fieldName}: ${error.message}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * 记录日志
     */
    log(message, type = 'info') {
        if (!this.isEnabled) return;

        const log = {
            timestamp: new Date().toISOString(),
            type,
            message
        };

        this.logs.push(log);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // 控制台输出
        switch (type) {
            case 'error':
                console.error(`[SBS Debug] ${message}`);
                break;
            case 'warn':
                console.warn(`[SBS Debug] ${message}`);
                break;
            case 'info':
                console.info(`[SBS Debug] ${message}`);
                break;
            default:
                console.log(`[SBS Debug] ${message}`);
        }

        // 浏览器调试器输出
        if (this.browserDebugger) {
            switch (type) {
                case 'error':
                    this.browserDebugger.addError(message);
                    break;
                case 'warn':
                    this.browserDebugger.addWarning(message);
                    break;
            }
        }
    }

    /**
     * 记录错误
     */
    error(message) {
        this.log(message, 'error');
    }

    /**
     * 记录警告
     */
    warn(message) {
        this.log(message, 'warn');
    }

    /**
     * 记录信息
     */
    info(message) {
        this.log(message, 'info');
    }

    /**
     * 获取日志
     */
    getLogs() {
        return this.logs;
    }

    /**
     * 清除日志
     */
    clearLogs() {
        this.logs = [];
        if (this.browserDebugger) {
            this.browserDebugger.debugData.errors = [];
            this.browserDebugger.debugData.warnings = [];
            this.browserDebugger.updateDisplay();
        }
    }

    /**
     * 设置最大日志数量
     */
    setMaxLogs(max) {
        this.maxLogs = max;
        while (this.logs.length > max) {
            this.logs.shift();
        }
    }

    /**
     * 获取调试状态
     */
    isDebugEnabled() {
        return this.isEnabled;
    }

    /**
     * 切换调试面板显示
     */
    toggleDebugPanel() {
        if (this.browserDebugger) {
            this.browserDebugger.toggle();
        }
    }

    /**
     * 获取所有断点
     */
    getBreakpoints() {
        return Array.from(this.breakpoints.entries()).map(([fieldName, bp]) => ({
            fieldName,
            enabled: bp.enabled,
            hitCount: bp.hitCount,
            hasCondition: !!bp.condition
        }));
    }

    /**
     * 启用/禁用断点
     */
    toggleBreakpoint(fieldName) {
        const bp = this.breakpoints.get(fieldName);
        if (bp) {
            bp.enabled = !bp.enabled;
            this.log(`Breakpoint ${bp.enabled ? 'enabled' : 'disabled'} for field: ${fieldName}`, 'info');
            
            if (this.browserDebugger) {
                this.browserDebugger.updateBreakpoint(fieldName, bp.enabled);
            }
        }
    }

    /**
     * 记录计算步骤
     */
    logCompute(message, data = null) {
        if (!this.isEnabled) return;

        const step = {
            time: new Date().toISOString(),
            type: 'info',
            message,
            data
        };

        this.computeSteps.push(step);
        if (this.browserDebugger) {
            this.browserDebugger.addComputeStep(message, 'info', data);
        }
    }

    /**
     * 记录计算错误
     */
    logComputeError(message, data = null) {
        if (!this.isEnabled) return;

        const step = {
            time: new Date().toISOString(),
            type: 'error',
            message,
            data
        };

        this.computeSteps.push(step);
        if (this.browserDebugger) {
            this.browserDebugger.addComputeStep(message, 'error', data);
        }
    }

    /**
     * 记录计算警告
     */
    logComputeWarning(message, data = null) {
        if (!this.isEnabled) return;

        const step = {
            time: new Date().toISOString(),
            type: 'warn',
            message,
            data
        };

        this.computeSteps.push(step);
        if (this.browserDebugger) {
            this.browserDebugger.addComputeStep(message, 'warn', data);
        }
    }

    /**
     * 清除计算步骤
     */
    clearComputeSteps() {
        this.computeSteps = [];
        if (this.browserDebugger) {
            this.browserDebugger.debugData.computeSteps = [];
            this.browserDebugger.updateDisplay();
        }
    }

    /**
     * 获取计算步骤
     */
    getComputeSteps() {
        return this.computeSteps;
    }
}

// 创建单例实例
const debug = new Debug();

export { debug }; 