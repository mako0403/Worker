import { ElLoading } from 'element-plus';

export class AxiosLoading {
    private loadingCount: number;
    private loading: any;

    constructor() {
        this.loadingCount = 0;
        this.loading = null;
    }

    private initLoading(): void {
        if (!this.loading) {
            this.loading = ElLoading.service({
                fullscreen: true,
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.2)',
            });
        }
    }

    public addLoading(): void {
        if (this.loadingCount === 0) {
            this.initLoading();
        }
        this.loadingCount++;
    }

    public closeLoading(): void {
        if (this.loadingCount > 0) {
            this.loadingCount--;
            if (this.loadingCount === 0 && this.loading) {
                this.loading.close();
                this.loading = null;
            }
        }
    }
}