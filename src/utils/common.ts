import moment from "moment"
import { ElLoading } from 'element-plus';

/**
 * Returns the current date in the specified format.
 *
 * @param date - The date to format. Default is the current date.
 * @param format - The format to use. Default is 'YYYY-MM-DD'.
 *
 * @returns The formatted date string.
 *
 * @example
 * ```typescript
 * const currentDate = getCurrentDate(); // '2022-01-01'
 * const formattedDate = getCurrentDate(new Date('2022-01-01'), 'YYYY/MM/DD'); // '2022/01/01'
 * ```
 */
export function getCurrentDate(date = new Date(), format = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const formats = {
		'YYYY年MM月DD日': `${year}年${month}月${day}日`,
        'YYYY-MM-DD': `${year}-${month}-${day}`,
        'YYYY/MM/DD': `${year}/${month}/${day}`,
        'MM-DD-YYYY': `${month}-${day}-${year}`,
        'DD-MM-YYYY': `${day}-${month}-${year}`,
        'HH:mm:ss': `${hour}:${minute}:${second}`,
        'YYYY-MM-DD HH:mm:ss': `${year}-${month}-${day} ${hour}:${minute}:${second}`,
        // Add more formats as needed
    };

    return formats[format] || formats['YYYY-MM-DD'];
};

/**
 * 获取指定天数的日期列表
 * @param count 天数
 * @param existingDays 剔除日期
 * @param options 可选参数 { fromToday: boolean }，是否从今天开始，默认 true
 * @returns [{date: '2021/08/01', day: '01', weekday: '一', offday: false},...]	
 */
export function getDates(count: number, existingDays: string[] = [], options: { fromToday?: boolean } = { fromToday: true }) {
    const dates = [];
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
    const today = new Date();
    const startOffset = options.fromToday ? 0 : -7;

    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + startOffset + i);
        const dateString = `${date.getFullYear()}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        const dayString = `${date.getDate().toString().padStart(2, '0')}`;
        const weekday = weekdays[(date.getDay() + 6) % 7];

        let isOff = false;
        existingDays.forEach((item: any) => {
            if (moment(item).format('YYYY/MM/DD') == dateString) {
                isOff = true;
            }
        });

        dates.push({ date: dateString, day: dayString, weekday: weekday, offday: isOff });
    }

    return dates;
}

/**
 * 将两个时间格式化为固定间隔并使用逗号分隔
 * @param startTime 
 * @param endTime 
 * @param interval 间隔时间
 * @param existingTimes 剔除时间
 * @returns 08:00,08:15,08:30
 */
export function generateTimeRange(startTime: string, endTime: string, interval: number = 15, existingTimes: string[] = []) {
	const result = [];
	let currentTime = new Date(`2000-01-01T${startTime}`);
	const endTimeObj = new Date(`2000-01-01T${endTime}`);

	while (currentTime <= endTimeObj) {
		const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		result.push(formattedTime);
		currentTime.setMinutes(currentTime.getMinutes() + interval);
	}

	return existingTimes ? result.filter(time => !existingTimes.includes(time)).join(',') : result.join(',');
}

/**
 * 以特定分钟数相隔，获取N分钟以后的连续时间
 * @param startTime "08:00"
 * @param interval 15
 * @param duration 90
 * @returns "08:00,08:15,08:30,08:45,09:00,09:15,09:30"
 */
export function afterTimeRange(startTime: string, interval: number, duration: number) {
	const times = [];
	const [startHour, startMinute] = startTime.split(':').map(Number);
	let currentTime = new Date(2000, 0, 1, startHour, startMinute);

	// 循环生成时间
	for (let i = 0; i <= duration; i += interval) {
		const hour = currentTime.getHours().toString().padStart(2, '0');
		const minute = currentTime.getMinutes().toString().padStart(2, '0');
		times.push(`${hour}:${minute}`);
		currentTime.setMinutes(currentTime.getMinutes() + interval);
	}

	return times.join(',');
}



// 判断数组中的时间是否按照指定间隔（默认15分钟）连续排列
export function continuousTimeRange(times: Array<string>, interval: number = 15): boolean {
	// 检查输入是否为空数组
	if (times.length === 0) return false;

	// 将时间字符串转换为分钟数
	const toMinutes = (time: string) => {
		const [hour, minute] = time.split(':').map(Number);
		return hour * 60 + minute;
	};

	for (let i = 1; i < times.length; i++) {
		const currentMinutes = toMinutes(times[i]);
		const prevMinutes = toMinutes(times[i - 1]);
		if (currentMinutes - prevMinutes !== interval) {
			return false; // 间隔不是指定的分钟数，返回 false
		}
	}
	return true; // 所有间隔都是指定的分钟数，返回 true
};


/**
 * 计算时间段时长
 * @param time [08:00,...,09:45]
 * @returns 
 */
export function formatTimeLimit(time: Array<string>) {
	// 将时间字符串转换为分钟数
	const toMinutes = (t:any) => {
		const [hour, minute] = t.split(':').map(Number);
		return hour * 60 + minute;
	};

	// 计算总共的分钟数
	const calculateTotalMinutes = (times:Array<string>) => {
		if (times.length < 2) return 0; // 至少需要两个时间点
		const startMinutes = toMinutes(times[0]);
		const endMinutes = toMinutes(times[times.length - 1]);
		return endMinutes - startMinutes;
	};

	// 将时间数组转换为范围字符串
	const toTimeRangeString = (times:any) => {
		if (times.length === 0) return ''; // 空数组处理
		const startTime = times[0];
		const endTime = times[times.length - 1];
		return `${startTime}~${endTime}`;
	};

	return {'minutes':calculateTotalMinutes(time), 'string':toTimeRangeString(time)};
}

/**
 * 增加分钟到给定时间
 * @param time 初始时间，格式为 "HH:mm"
 * @param minutes 增加的分钟数
 * @returns 增加分钟后的时间，格式为 "HH:mm"
 */
export function addMinutesToTime(time: string, minutes: number): string {
	const [hours, mins] = time.split(':').map(Number);
    
	// 计算总分钟数
	const totalMinutes = Number(hours) * 60 + Number(mins) + Number(minutes);

	// 计算新的小时和分钟
	const newHours = Math.floor(totalMinutes / 60) % 24;
	const newMinutes = totalMinutes % 60;
  
	// 格式化小时和分钟
	const formattedHours = String(newHours).padStart(2, '0');
	const formattedMinutes = String(newMinutes).padStart(2, '0');
  console.log(formattedHours, formattedMinutes)
	return `${formattedHours}:${formattedMinutes}`;
  }

/**
 * 将blob图片地址转换为base64
 * @param blob 
 * @returns 
 */
export function blobToBase64 (blob:Blob){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

/**
 * 延迟几秒
 * @param ms 
 * @returns 
 */
export function delay (ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 加载动画
 */
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