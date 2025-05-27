import axios from '@/utils/axios';

class WeChatAuth {
  private redirectUri: string;
  private state: string;
  private scope: string;

  constructor(redirectUri: string, state: string = '', scope: string = 'snsapi_userinfo') {
    this.redirectUri = redirectUri;
    this.state = state;
    this.scope = scope;
  }

  public isWeChatBrowser(): boolean {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('micromessenger');
  }

  public async authorize() {
    const response = await axios.post('/wechat/get_redirect_url', {redirect_url:this.redirectUri, state:this.state, scope:this.scope});
    window.location.href = response.data;
  }

  public async getAccessToken(code: string): Promise<any> {
    const response = await axios.get('/wechat/get_access_token', {code:code});
    return response.data;
  }

  public async getUserInfo(accessToken: string, openid: string): Promise<any> {
    const response = await axios.get('/wechat/get_user_info', {access_token:accessToken, openid:openid});
    return response.data;
  }

}

export default WeChatAuth;
