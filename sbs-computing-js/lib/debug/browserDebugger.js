import { computingProcess } from '../core/computingProcess.js';

/**
 * 浏览器调试器类
 */
class BrowserDebugger {
    constructor() {
        this.isOpen = false;
        this.debugData = {
            config: {},
            variables: {},
            formulas: {},
            dependencies: {},
            errors: [],
            warnings: [],
            breakpoints: [],
            computeSteps: [], // 计算步骤记录
            performance: {
                lastUpdate: null,
                updateCount: 0,
                averageTime: 0
            }
        };

        // 创建调试面板
        this.createDebugPanel();
    }

    /**
     * 创建调试面板
     */
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'sbs-debug-panel';
        panel.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 400px;
            height: 100vh;
            background: #1e1e1e;
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            overflow: hidden;
            display: none;
            flex-direction: column;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px;
            background: #2d2d2d;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #3d3d3d;
        `;

        const title = document.createElement('span');
        title.textContent = 'SBS Computing Debugger';
        title.style.fontWeight = 'bold';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = () => this.toggle();

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 创建输入区域
        const inputSection = this.createInputSection();

        // 创建内容区域
        const content = document.createElement('div');
        content.id = 'sbs-debug-content';
        content.style.cssText = `
            flex: 1;
            padding: 10px;
            overflow: auto;
        `;

        panel.appendChild(header);
        panel.appendChild(inputSection);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 创建调试数据展示区域
        this.createDebugSections(content);
    }

    /**
     * 创建输入区域
     */
    createInputSection() {
        const section = document.createElement('div');
        section.style.cssText = `
            padding: 10px;
            background: #2d2d2d;
            border-bottom: 1px solid #3d3d3d;
        `;

        // 创建配置输入
        const configInput = document.createElement('div');
        configInput.style.cssText = `
            margin-bottom: 10px;
        `;

        const configLabel = document.createElement('div');
        configLabel.textContent = 'Configuration:';
        configLabel.style.marginBottom = '5px';

        const textarea = document.createElement('textarea');
        textarea.id = 'sbs-debug-config-input';
        textarea.style.cssText = `
            width: 100%;
            height: 100px;
            background: #1e1e1e;
            color: #fff;
            border: 1px solid #3d3d3d;
            border-radius: 4px;
            padding: 8px;
            font-family: monospace;
            resize: vertical;
        `;
        textarea.placeholder = `Example:
{
    "price": { "value": 100 },
    "quantity": { "value": 5 },
    "total": { "eqn": "price * quantity" }
}`;

        // 创建按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 8px;
        `;

        const applyBtn = this.createButton('Apply', () => this.applyConfig());
        const clearBtn = this.createButton('Clear', () => this.clearConfig());
        const exampleBtn = this.createButton('Load Example', () => this.loadExample());

        buttonGroup.appendChild(applyBtn);
        buttonGroup.appendChild(clearBtn);
        buttonGroup.appendChild(exampleBtn);

        configInput.appendChild(configLabel);
        configInput.appendChild(textarea);
        configInput.appendChild(buttonGroup);
        section.appendChild(configInput);

        return section;
    }

    /**
     * 创建按钮
     */
    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: #3d3d3d;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            &:hover {
                background: #4d4d4d;
            }
        `;
        button.onclick = onClick;
        return button;
    }

    /**
     * 创建调试数据展示区域
     */
    createDebugSections(container) {
        // Compute process section
        const computeSection = this.createSection('Compute Process', 'compute');
        container.appendChild(computeSection);

        // Performance section
        const performanceSection = this.createSection('Performance', 'performance');
        container.appendChild(performanceSection);

        // Configuration section
        const configSection = this.createSection('Configuration', 'config');
        container.appendChild(configSection);

        // Variables section
        const variablesSection = this.createSection('Variables', 'variables');
        container.appendChild(variablesSection);

        // Formulas section
        const formulasSection = this.createSection('Formulas', 'formulas');
        container.appendChild(formulasSection);

        // Dependencies section
        const dependenciesSection = this.createSection('Dependencies', 'dependencies');
        container.appendChild(dependenciesSection);

        // Errors and Warnings section
        const errorsSection = this.createSection('Errors and Warnings', 'errors');
        container.appendChild(errorsSection);

        // Breakpoints section
        const breakpointsSection = this.createSection('Breakpoints', 'breakpoints');
        container.appendChild(breakpointsSection);
    }

    /**
     * 创建调试区域部分
     * @param {string} title - 区域标题
     * @param {string} id - 区域ID
     * @returns {HTMLElement} - 创建的区域元素
     */
    createSection(title, id) {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 20px;
            background: #2d2d2d;
            border-radius: 4px;
            overflow: hidden;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 8px 12px;
            background: #3d3d3d;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = title;

        // 创建内容区域
        const content = document.createElement('div');
        content.id = `sbs-debug-${id}`;
        content.style.cssText = `
            padding: 12px;
            font-size: 11px;
            line-height: 1.4;
            max-height: 200px;
            overflow-y: auto;
        `;

        section.appendChild(header);
        section.appendChild(content);

        return section;
    }

    /**
     * 应用配置
     */
    applyConfig() {
        const textarea = document.getElementById('sbs-debug-config-input');
        try {
            const config = JSON.parse(textarea.value);
            this.updateDebugData(config);
            this.addComputeStep('Applied new configuration', 'info', config);
        } catch (error) {
            this.addError(`Failed to parse configuration: ${error.message}`);
        }
    }

    /**
     * 清除配置
     */
    clearConfig() {
        const textarea = document.getElementById('sbs-debug-config-input');
        textarea.value = '';
        this.debugData.config = {};
        this.debugData.variables = {};
        this.debugData.formulas = {};
        this.debugData.dependencies = {};
        this.debugData.computeSteps = [];
        this.updateDisplay();
    }

    /**
     * 加载示例
     */
    loadExample() {
        const example = {
            "price": { value: 100 },
            "quantity": { value: 5 },
            "discount": { value: 10 },
            "subtotal": { eqn: "price * quantity" },
            "total": { eqn: "subtotal * (1 - discount / 100)" }
        };
        const textarea = document.getElementById('sbs-debug-config-input');
        textarea.value = JSON.stringify(example, null, 2);
    }

    /**
     * 添加计算步骤
     */
    addComputeStep(message, type, data = null) {
        this.debugData.computeSteps.push({
            time: new Date().toISOString(),
            type,
            message,
            data
        });
        this.updateDisplay();
    }

    /**
     * 更新调试数据
     */
    updateDebugData(config) {
        const startTime = performance.now();
        
        // 更新配置信息
        this.debugData.config = config;

        // 更新变量信息
        this.debugData.variables = Object.entries(config).reduce((acc, [key, field]) => {
            acc[key] = {
                value: field.value,
                type: typeof field.value,
                formula: field.eqn || null
            };
            return acc;
        }, {});

        // 更新公式信息
        this.debugData.formulas = Object.entries(config).reduce((acc, [key, field]) => {
            if (field.eqn) {
                acc[key] = {
                    formula: field.eqn,
                    variables: field.__variable__ || [],
                    result: field.value
                };
            }
            return acc;
        }, {});

        // 更新依赖关系
        this.debugData.dependencies = Object.entries(config).reduce((acc, [key, field]) => {
            if (field.__variable__) {
                acc[key] = field.__variable__;
            }
            return acc;
        }, {});

        // 更新性能信息
        const endTime = performance.now();
        const updateTime = endTime - startTime;
        this.debugData.performance = {
            lastUpdate: new Date().toISOString(),
            updateCount: this.debugData.performance.updateCount + 1,
            averageTime: (this.debugData.performance.averageTime * this.debugData.performance.updateCount + updateTime) / (this.debugData.performance.updateCount + 1)
        };

        // 更新显示
        this.updateDisplay();
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        // 更新计算过程
        const computeEl = document.getElementById('sbs-debug-compute');
        if (computeEl) {
            const steps = this.debugData.computeSteps.map(step => `
                <div class="compute-step" style="
                    margin-bottom: 8px;
                    padding: 8px;
                    background: ${this.getStepBackground(step.type)};
                    border-radius: 4px;
                ">
                    <div style="color: ${this.getStepColor(step.type)};">
                        ${step.message}
                    </div>
                    ${step.data ? `
                        <div style="
                            margin-top: 4px;
                            font-size: 11px;
                            color: #888;
                            white-space: pre-wrap;
                        ">${JSON.stringify(step.data, null, 2)}</div>
                    ` : ''}
                    <div style="
                        font-size: 10px;
                        color: #666;
                        margin-top: 4px;
                    ">${step.time}</div>
                </div>
            `).join('');
            computeEl.innerHTML = steps || '<div style="color: #666;">No computation steps recorded</div>';
        }

        // 更新性能信息
        const performanceEl = document.getElementById('sbs-debug-performance');
        if (performanceEl) {
            performanceEl.innerHTML = `
                <div>Last updated: ${this.debugData.performance.lastUpdate}</div>
                <div>Update count: ${this.debugData.performance.updateCount}</div>
                <div>Average time: ${this.debugData.performance.averageTime.toFixed(2)}ms</div>
            `;
        }

        // 更新配置信息
        const configEl = document.getElementById('sbs-debug-config');
        if (configEl) {
            configEl.innerHTML = this.formatObject(this.debugData.config);
        }

        // 更新变量信息
        const variablesEl = document.getElementById('sbs-debug-variables');
        if (variablesEl) {
            variablesEl.innerHTML = this.formatObject(this.debugData.variables);
        }

        // 更新公式信息
        const formulasEl = document.getElementById('sbs-debug-formulas');
        if (formulasEl) {
            formulasEl.innerHTML = this.formatObject(this.debugData.formulas);
        }

        // 更新依赖关系
        const dependenciesEl = document.getElementById('sbs-debug-dependencies');
        if (dependenciesEl) {
            dependenciesEl.innerHTML = this.formatObject(this.debugData.dependencies);
        }

        // 更新错误和警告
        const errorsEl = document.getElementById('sbs-debug-errors');
        if (errorsEl) {
            const errors = this.debugData.errors.map(err => `<div style="color: #ff6b6b">${err}</div>`);
            const warnings = this.debugData.warnings.map(warn => `<div style="color: #ffd93d">${warn}</div>`);
            errorsEl.innerHTML = [...errors, ...warnings].join('');
        }

        // 更新断点信息
        const breakpointsEl = document.getElementById('sbs-debug-breakpoints');
        if (breakpointsEl) {
            const breakpointsList = this.debugData.breakpoints.map(bp => `
                <div class="breakpoint ${bp.enabled ? 'enabled' : 'disabled'}" style="
                    margin-bottom: 8px;
                    padding: 8px;
                    background: ${bp.enabled ? '#2d4a3e' : '#3d3d3d'};
                    border-radius: 4px;
                ">
                    <div style="display: flex; justify-content: space-between;">
                        <span>${bp.fieldName}</span>
                        <span style="color: ${bp.enabled ? '#4caf50' : '#9e9e9e'}">
                            ${bp.enabled ? '●' : '○'}
                        </span>
                    </div>
                    <div style="font-size: 11px; color: #888; margin-top: 4px;">
                        Condition: ${bp.condition}
                    </div>
                    <div style="font-size: 11px; color: #888;">
                        Hit count: ${bp.hitCount}
                    </div>
                </div>
            `).join('');

            breakpointsEl.innerHTML = breakpointsList || '<div style="color: #666;">No breakpoints set</div>';
        }
    }

    /**
     * 格式化对象为HTML
     */
    formatObject(obj, level = 0) {
        if (obj === null) return 'null';
        if (typeof obj !== 'object') return String(obj);

        const indent = '  '.repeat(level);
        const entries = Object.entries(obj);
        
        if (entries.length === 0) return '{}';

        return entries.map(([key, value]) => {
            const formattedValue = typeof value === 'object' 
                ? this.formatObject(value, level + 1)
                : String(value);
            
            return `${indent}${key}: ${formattedValue}`;
        }).join('<br>');
    }

    /**
     * 获取步骤背景色
     */
    getStepBackground(type) {
        switch (type) {
            case 'error': return '#2d1e1e';
            case 'warn': return '#2d2a1e';
            case 'info': return '#1e2d2d';
            default: return '#2d2d2d';
        }
    }

    /**
     * 获取步骤文字颜色
     */
    getStepColor(type) {
        switch (type) {
            case 'error': return '#ff6b6b';
            case 'warn': return '#ffd93d';
            case 'info': return '#4caf50';
            default: return '#fff';
        }
    }

    /**
     * 切换调试面板显示状态
     */
    toggle() {
        const panel = document.getElementById('sbs-debug-panel');
        this.isOpen = !this.isOpen;
        panel.style.display = this.isOpen ? 'flex' : 'none';
    }

    /**
     * 添加错误信息
     */
    addError(error) {
        this.debugData.errors.push({
            time: new Date().toISOString(),
            message: error
        });
        this.updateDisplay();
    }

    /**
     * 添加警告信息
     */
    addWarning(warning) {
        this.debugData.warnings.push({
            time: new Date().toISOString(),
            message: warning
        });
        this.updateDisplay();
    }

    /**
     * 添加断点
     */
    addBreakpoint(fieldName, condition) {
        this.debugData.breakpoints.push({
            fieldName,
            condition: condition ? condition.toString() : 'none',
            enabled: true,
            hitCount: 0,
            timestamp: new Date().toISOString()
        });
        this.updateDisplay();
    }

    /**
     * 移除断点
     */
    removeBreakpoint(fieldName) {
        const index = this.debugData.breakpoints.findIndex(bp => bp.fieldName === fieldName);
        if (index !== -1) {
            this.debugData.breakpoints.splice(index, 1);
            this.updateDisplay();
        }
    }

    /**
     * 更新断点状态
     */
    updateBreakpoint(fieldName, enabled) {
        const breakpoint = this.debugData.breakpoints.find(bp => bp.fieldName === fieldName);
        if (breakpoint) {
            breakpoint.enabled = enabled;
            this.updateDisplay();
        }
    }
}

/**
 * 处理配置变更的回调函数
 * @param {string} key - 变更的配置键
 * @param {*} value - 新的值
 * @param {Object} target - 目标对象
 */
export function changeObCallbackHandle(key, value, target) {
    if (!target || !target.fkey) return;
    
    // 使用 requestAnimationFrame 优化性能
    requestAnimationFrame(() => {
        computingProcess(target, (config) => {
            // 在这里可以添加计算完成后的回调逻辑
            console.log(`[Browser Debug] Computation completed for ${key}`, {
                key,
                newValue: value,
                target
            });
        });
    });
}

// 创建调试器实例
const browserDebugger = new BrowserDebugger();

export { browserDebugger as default }; 