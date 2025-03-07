export class BrowserDebugger {
    constructor() {
        this.initDevTools();
    }

    initDevTools() {
        if (typeof document === 'undefined') return;

        // 创建调试面板
        const debugPanel = document.createElement('div');
        debugPanel.id = 'sbs-debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 300px;
            height: 100vh;
            background: #f5f5f5;
            padding: 10px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 9999;
        `;

        document.body.appendChild(debugPanel);
    }

    updatePanel(data) {
        if (typeof document === 'undefined') return;

        const panel = document.getElementById('sbs-debug-panel');
        if (!panel) return;

        const logEntry = document.createElement('div');
        logEntry.className = 'debug-entry';
        logEntry.style.cssText = `
            margin: 5px 0;
            padding: 5px;
            background: white;
            border-radius: 4px;
            font-family: monospace;
        `;

        const timestamp = new Date().toLocaleTimeString();
        logEntry.innerHTML = `
            <div style="color: #666; font-size: 12px;">${timestamp}</div>
            <div style="margin-top: 5px;">${JSON.stringify(data, null, 2)}</div>
        `;

        panel.appendChild(logEntry);
        panel.scrollTop = panel.scrollHeight;
    }
} 