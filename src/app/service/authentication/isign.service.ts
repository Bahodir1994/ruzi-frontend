import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../configuration/resursurls/apiConfig.service';
import {FindResultApiUrl} from '../../configuration/resursurls/apiConfigDto';

@Injectable({
  providedIn: 'root'
})
export class IsignService {
  private moduleUrl!: FindResultApiUrl;

  private ws: WebSocket | null = null;
  public listCerts: any[] = [];

  private readonly ws_TYPE_REQUEST = 1;
  private readonly ws_TYPE_RESPONSE = 2;
  private readonly ws_TYPE_NOTIFY = 3;

  private readonly ws_FUNC_KEYLIST = 5;
  private readonly ws_FUNC_VERSION = 6;

  public connected = false;
  private callbacks: Function[] = [];

  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws = new WebSocket('wss://127.0.0.1:44443');

    this.ws.onopen = () => {
      this.connected = true;
      this.reqVersion();
    };

    this.ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      this.ws?.close();
    };

    this.ws.onclose = (event) => {
      this.connected = false;
      console.warn('WebSocket closed:', event.reason);
    };

    this.ws.onmessage = async (e) => {
      const responseData = JSON.parse(e.data);
      const callback = this.callbacks.pop();
      if (
        responseData.type === this.ws_TYPE_RESPONSE &&
        typeof callback === 'function'
      ) {
        callback(responseData);
      }
      if (
        (responseData.code === 4 || responseData.code === 2) &&
        responseData.type === this.ws_TYPE_NOTIFY
      ) {
        await this.getKeyList();
      }
    };
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.ws?.readyState === 1) {
          resolve();
        } else {
          setTimeout(checkConnection, 1000);
        }
      };
      checkConnection();
    });
  }

  private async sendRequest(request: any): Promise<any> {
    await this.waitForConnection();
    return new Promise((resolve, reject) => {
      this.callbacks.push(resolve);
      try {
        this.ws?.send(JSON.stringify(request));
      } catch (error) {
        reject(error);
      }
    });
  }

  public async reqVersion(): Promise<void> {
    const request = {
      type: this.ws_TYPE_REQUEST,
      func: this.ws_FUNC_VERSION
    };
    try {
      const response = await this.sendRequest(request);
      console.log('Version response:', response);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  public async getKeyList(): Promise<any[]> {
    const request = {
      type: this.ws_TYPE_REQUEST,
      func: this.ws_FUNC_KEYLIST
    };

    try {
      const response = await this.sendRequest(request);
      const json = response;

      const list: any[] = [];
      if (json?.list) {
        json.list.forEach((cert: string) => {
          if (cert.startsWith('DEV=')) {
            const obj: any = {};
            cert.split(',').forEach((pair) => {
              const [key, value] = pair.split('=');
              obj[key] = value;
            });
            list.push(obj);
          }
        });
      }

      this.listCerts = list;
      return list;
    } catch (error) {
      console.error('Error in getKeyList:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  async checkPassword(certUid: string, password: string): Promise<object | string | undefined> {
    const ikeyData = certUid + Date.now();

    try {
      let firstResponse = await this.sendRequest({
        type: 1, // ws_TYPE_REQUEST
        func: 1, // ws_FUNC_HASH
        data: ikeyData
      });

      const firstJson = JSON.parse(JSON.stringify(firstResponse));
      const ikeydatahash = firstJson.hash;

      let secondResponse = await this.sendRequest({
        type: 1, // ws_TYPE_REQUEST
        func: 2, // ws_FUNC_SIGN
        pass: password,
        snum: "E-KALIT",
        data: ikeydatahash,
        token: 'eVEV41H9AJtQNKFU1k2TYcHQr8W37/toxC7YQSgdr0Sx+EuqPlJ1W1Z3jKldFTI/4hqxRw==' // maybe make this configurable
      });

      const secondJson = JSON.parse(JSON.stringify(secondResponse));

      if (secondJson.code === 1) {
        const payload = {
          cerB64: secondJson.cert,
          text: ikeyData,
          textHash: ikeydatahash,
          signData: secondJson.sign,
          login: secondJson.subj["1.2.860.3.16.1.2"]
        };

        const responseDto = await firstValueFrom(this.isigner_post(payload));

        const redirectUrl = responseDto?.link;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }

        return responseDto;
      } else {
        return 'incorrect_pass';
      }

    } catch (error) {
      console.error('Error during password check:', error);
      return undefined;
    }
  }

  isigner_post(body: any): Observable<any> {
    return this.apiConfigService.loadConfigAndGetResultUrl('lab-auth', 'check_isigner').pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;

          const formData = new URLSearchParams();
          for (const key in body) {
            if (body.hasOwnProperty(key)) {
              formData.set(key, body[key]);
            }
          }

          return this.http.post<any>(
            `${this.moduleUrl.host}${this.moduleUrl.url}`,
            formData.toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
        } else {
          throw new Error('URL не был получен');
        }
      })
    );
  }

}
