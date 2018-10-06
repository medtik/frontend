import Vue from 'vue';
import {Module, ActionContext} from 'vuex';
import {RootState} from './types/common';
import {IProvider, ProviderModel} from './models/provider.model';
import {IResume, ResumeModel} from './models/resume.model';
import {apiRequest} from './api-request.decorator';
import {IGetProviderRedirect, IGetProviderAuth, IToggleResume} from '../service/interfaces';
import {router} from '../router';

export interface ProvidersState {
  providers: ProviderModel[];
  resumes: ResumeModel[];
}

class ProvidersApi {
  @apiRequest()
  public requestProviders({ commit }: ActionContext<ProvidersState, RootState>, payload: any): any  {
    return Vue.apiService.makeRequest({url: 'auth/providers'})
      .then((result) => {
        commit('setProviders', result);
      });
  }

  /**
   * make auth redirect
   * return true if everything is ok, false otherwise
   * @param commit
   * @param state
   * @param provider
   */
  @apiRequest()
  public getProviderRedirect({ commit, state }: ActionContext<ProvidersState, RootState>, provider ): Promise<boolean> {
    return Vue.apiService.makeRequest({url: 'auth/' + provider})
      .then((result: IGetProviderRedirect) => {
        const current = state.providers.find((i) => i.name === provider);
        if (current) {
          current.logged = true;
          current.redirectUrl = result.redirect;
          commit('setProviders', state.providers);
          window.location.href = result.redirect;
        }
        return true;
      })
      .catch(() => false);
  }

  @apiRequest()
  public getAuthToken({ commit, dispatch }: ActionContext<ProvidersState, RootState>, {provider, code}): any {
    return Vue.apiService.makeRequest({url: 'auth/' + provider, method: 'POST', body: {code}})
      .then((result: IGetProviderAuth) => {
        localStorage.setItem('token', result.token);
        commit('setToken', result.token, {root: true});
        router.push({name: 'resume'});
        dispatch('refreshToken', result.token, {root: true});
      });
  }

  @apiRequest()
  public getResumes({ commit }: ActionContext<ProvidersState, RootState>, payload: any): any {
    return Vue.apiService.makeRequest({url: 'resume/list', auth: true})
      .then((result: IProvider) => {
        const providers: ProviderModel[] = [];
        for(let key in result) {
          const provider = new ProviderModel(key);
          provider.logged = true;
          provider.resumes = result[key].map((i: IResume) => new ResumeModel(i));
          providers.push(provider);
        }
        commit('setProviders', providers);
        const resumes = result;
        commit('setResumes', resumes);
      });
  }

  @apiRequest()
  public toggleResume({ commit, state }: ActionContext<ProvidersState, RootState>, uniq): any {
    return Vue.apiService.makeRequest<IToggleResume>({url: 'resume/toggle', method: 'POST', auth: true, body: {uniq}})
      .then((result: IToggleResume) => {
        const current: ResumeModel = state.resumes.find((i: ResumeModel) => i.identity === uniq);
        if (current) {
          current.enabled = result.enabled;
          commit('setResumes', state.resumes);
        }
      });
  }
}

const providersApi = new ProvidersApi();

export const providersModule: Module<ProvidersState, RootState> = {
  namespaced: true,

  state: {
    providers: [],
    resumes: [],
  },

  getters: {
    getProviders: (state) => state.providers,
    resumes: (state) => state.resumes,
  },

  mutations: {
    setProviders(state, value: Array<string|ProviderModel>) {
      state.providers = value.map((i) => new ProviderModel(i));
    },
    setResumes(state, value) {
      state.resumes = value;
    },
  },

  actions: {
    requestProviders: (...args) => providersApi.requestProviders(...args),
    getProviderRedirect: (...args) => providersApi.getProviderRedirect(...args),
    getAuthToken: (...args) => providersApi.getAuthToken(...args),
    getResumes: (...args) => providersApi.getResumes(...args),
    toggleResume: (...args) => providersApi.toggleResume(...args),
  },
};
