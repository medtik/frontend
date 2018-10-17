import Vue from 'vue';
import {Module, ActionContext} from 'vuex';
import {RootState} from './types/common';
import {IProvider, ProviderModel} from './models/provider.model';
import {apiRequest} from './api-request.decorator';
import {IGetProviderRedirect, IGetProviderAuth, IToggleResume} from '../service/interfaces';
import {router} from '../router';

export interface ProvidersState {
  providersList: string[];
  providers: ProviderModel[];
}

class ProvidersApi {
  @apiRequest()
  public getProviders({ commit }: ActionContext<ProvidersState, RootState>, payload: any): any  {
    return Vue.apiService.makeRequest({url: 'auth/providers'})
      .then((result: string[]) => {
        commit('setProvidersList', result);
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
        window.location.href = result.redirect;
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
    return Vue.apiService.makeRequest({url: 'resume', auth: true})
      .then((result: IProvider[]) => {
        const providers: ProviderModel[] = result.map(i => new ProviderModel(i));
        commit('setProviders', providers);
      });
  }

  @apiRequest()
  public toggleResume({ commit, state }: ActionContext<ProvidersState, RootState>, identity): any {
    return Vue.apiService.makeRequest<IToggleResume>({url: 'resume', method: 'POST', auth: true, body: {identity}})
      .then((result: IToggleResume) => {
        const current: ProviderModel = state.providers.find((provider: ProviderModel) => {
          return !!provider.resumes.find(i => {
            if (i.identity === identity) {
              i.enabled = result.enabled;
              return true;
            } else {
              return false;
            }
          });
        });
        if (current) {
          commit('setProviders', state.providers);
        }
      });
  }
}

const providersApi = new ProvidersApi();

export const providersModule: Module<ProvidersState, RootState> = {
  namespaced: true,

  state: {
    providersList: [],
    providers: [],
  },

  getters: {
    providersList: (state) => state.providersList,
    providers: (state) => state.providers,
  },

  mutations: {
    setProvidersList(state, value: string[]) {
      state.providersList = value;
    },
    setProviders(state, value: ProviderModel[]) {
      state.providers = value;
    },
  },

  actions: {
    getProviders: (...args) => providersApi.getProviders(...args),
    getProviderRedirect: (...args) => providersApi.getProviderRedirect(...args),
    getAuthToken: (...args) => providersApi.getAuthToken(...args),
    getResumes: (...args) => providersApi.getResumes(...args),
    toggleResume: (...args) => providersApi.toggleResume(...args),
  },
};
