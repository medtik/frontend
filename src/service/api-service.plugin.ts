import Vue, {PluginObject} from 'vue';
import {router} from '../router';
import {store} from '../store';
import {CONFIG} from '../config';

export interface IRequestParams {
  url: string;
  method?: 'GET'|'POST';
  body?: any;
  auth?: boolean;
}

interface IError {
  error: string;
  message: string;
  status: number;
}

export class ApiService {
  public async makeRequest<R>(params: IRequestParams): Promise<R> {
    const headers = new Headers({'Content-Type': 'application/json'});
    if (!params.method) {
      params.method = 'GET';
    }
    if (params.auth) {
      headers.append('Authorization', `JWT ${localStorage.getItem('token')}`);
    }
    const response = await fetch(
      CONFIG.apiUrl + params.url,
      {
        method: params.method,
        headers,
        body: params.body ? JSON.stringify(params.body) : null,
      }
    );
    return await this._parseResponse(response);
  }

  private _parseResponse(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      if (response.status === 401) {
        store.dispatch('logout');
        return response.json().then((result: IError) => Promise.reject(new Error(result.message)));
      } else {
        return response.json();
      }
    }
  }
}

export const ApiServicePlugin: PluginObject<any> = {
  install(vue: typeof Vue, options: any) {
    vue.apiService = new ApiService();
    vue.prototype.$apiService = vue.apiService;
  },
};
