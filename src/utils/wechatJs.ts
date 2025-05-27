import axios from '@/utils/axios';
import wx from 'weixin-js-sdk';
import { ElMessage } from 'element-plus';

interface WechatConfig {
    appId: string;
    timestamp: number;
    nonceStr: string;
    signature: string;
    jsApiList: string[];
}

class wechatJs {
    private isReady: boolean = false;

    /**
     * 初始化微信JS SDK
     * @param config 配置项
     */
    async init(config: WechatConfig): Promise<void> {
        const response = await axios.get('/wechat/wechat_js_sign', { url: window.location.href });
        return new Promise((resolve, reject) => {
            // wx.config({
            //     debug: false, // 开启调试模式, 调用时会有日志输出
            //     appId: config.appId, // 必填，公众号的唯一标识
            //     timestamp: config.timestamp, // 必填，生成签名的时间戳
            //     nonceStr: config.nonceStr, // 必填，生成签名的随机串
            //     signature: config.signature, // 必填，签名
            //     jsApiList: config.jsApiList, // 必填，需要使用的JS接口列表
            // });

            wx.config(response.data)

            wx.ready(() => {
                this.isReady = true;
                resolve();
            });

            wx.error((error: any) => {
                console.error('微信JS SDK初始化失败', error);
                reject(error);
            });
        });
    }

    /**
     * 微信支付
     * @param options 分享配置项
     */
    async payOrder(options: { bill_no: string; openid: string; back_to_page: string; }) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) {
                console.error('Wechat JS SDK is not ready');
                reject('Wechat JS SDK is not ready');
                return;
            }
    
            let response; // 将 response 提升到 try 外部，确保作用域正确
    
            try {
                response = await axios.post('/payment/payorder', { 
                    bill_no: options.bill_no, 
                    openid: options.openid 
                }, { toast: 0 });
    
                console.log(1111, response);
            } catch (error) {
                reject(error);
                return; // 如果捕获到错误，直接 return 避免继续执行后续代码
            }
    
            // 确保 response 已正确获取后再调用 wx.chooseWXPay
            if (response && response.data) {
                wx.chooseWXPay({
                    timestamp: response.data.timestamp,
                    nonceStr: response.data.nonceStr,
                    package: response.data.package,
                    signType: response.data.signType,
                    paySign: response.data.paySign,
                    success: (res) => {
                        ElMessage.success('支付成功');
                        resolve(res);
                    },
                    fail: (err) => {
                        ElMessage.error('支付失败，请重试！');
                        reject(err);
                    },
                    cancel: () => {
                        ElMessage.info('请继续完成支付');
                        reject('cancel');
                    },
                });
            } else {
                reject('Invalid response data');
            }
        });
    }
    

    /**
     * 分享到朋友圈
     * @param options 分享配置项
     */
    shareToTimeline(options: { title: string; link: string; imgUrl: string }) {
        return new Promise(async (resolve, reject) => {
            if (!this.isReady) {
                reject('Wechat JS SDK is not ready');
                return;
            }
            
            wx.updateTimelineShareData({
                title: options.title, // 分享标题
                link: options.link, // 分享链接
                imgUrl: options.imgUrl, // 分享图标
                success: () => {
                    console.log('分享到朋友圈成功1');
                    resolve('success');
                },
                fail: (error: any) => {
                    console.error('分享到朋友圈失败1', error);
                    reject(error);
                },
            });
            // wx.ready(() => {
            //     wx.onMenuShareTimeline({
            //         title: options.title, // 分享标题
            //         link: options.link, // 分享链接
            //         imgUrl: options.imgUrl, // 分享图标
            //         success: () => {
            //             console.log('分享到朋友圈成功2');
            //             resolve('success');
            //         },
            //         fail: (error: any) => {
            //             console.error('分享到朋友圈失败2', error);
            //             reject(error);
            //         },
            //     })
            // });
        });
    }

    /**
     * 分享给朋友
     * @param options 分享配置项
     */
    shareToFriend(options: { title: string; desc: string; link: string; imgUrl: string }) {
        if (!this.isReady) {
            console.error('Wechat JS SDK is not ready');
            return;
        }

        wx.updateAppMessageShareData({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success: () => {
                console.log('分享给朋友成功');
            },
            fail: (error: any) => {
                console.error('分享给朋友失败', error);
            },
        });
    }

    /**
     * 扫描二维码
     */
    scanQRCode(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                console.error('Wechat JS SDK is not ready');
                reject('Wechat JS SDK is not ready');
                return;
            }

            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: (res: any) => {
                    resolve(res);
                },
                fail: (error: any) => {
                    reject(error);
                },
            });
        });
    }
}

export default wechatJs;