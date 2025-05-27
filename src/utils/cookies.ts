import Cookies from 'js-cookie'

export function initERPAuth() {
    const uuid = getUUID();
    const expireTime = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 15); // 当前时间+1小时

    if (!localStorage.getItem('ERPAuth')) {
        localStorage.setItem('ERPAuth', uuid);
    }

    if (!Cookies.get('ERPAuth')) {
        Cookies.set('ERPAuth', uuid, { expires: expireTime });
    }

    if (Cookies.get('ERPAuth') !== localStorage.getItem('ERPAuth')) {
        Cookies.set('ERPAuth', localStorage.getItem('ERPAuth')!);
    }
}

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}