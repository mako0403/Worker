import type { AxiosRequestConfig } from "axios";

export class AxiosCancel {
    private pendingMap: Map<string, AbortController>;

    constructor() {
        this.pendingMap = new Map<string, AbortController>();
    }
    
    generateKey(config: AxiosRequestConfig): string {
        const { method = '', url = '' } = config;
        return `${method}&${url}`;
    }

    addPending(config: AxiosRequestConfig): void {
        this.removePending(config);
        const key: string = this.generateKey(config);
        if (!this.pendingMap.has(key)) {
            const controller = new AbortController();
            config.signal = controller.signal;
            this.pendingMap.set(key, controller);
        } else {
            config.signal = (this.pendingMap.get(key) as AbortController).signal;
        }
    }

    removePending(config: AxiosRequestConfig): void {
        const key: string = this.generateKey(config);
        if (this.pendingMap.has(key)) {
            (this.pendingMap.get(key) as AbortController).abort();
            this.pendingMap.delete(key);
        }
    }

    removeAllPending(): void {
        this.pendingMap.forEach((controller: AbortController) => {
            controller.abort();
        });
        this.reset();
    }

    private reset(): void {
        this.pendingMap = new Map<string, AbortController>();
    }
}