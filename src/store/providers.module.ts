import Vue from 'vue';
import {Module, ActionContext} from 'vuex';
import {RootState} from './types/common';
import {IProvider, ProviderModel} from './models/provider.model';
import {apiRequest} from './api-request.decorator';
import {IGetProviderRedirect, IGetProviderAuth, IToggleResume} from '../service/interfaces';
import {router} from '../router';

export interface ProvidersState {
  providers: ProviderModel[];
}

class ProvidersApi {
  @apiRequest()
  public requestProviders({ commit }: ActionContext<ProvidersState, RootState>, payload: any): any  {
    return Vue.apiService.makeRequest({url: 'auth/providers'})
      .then((result: string[]) => {
        const providers = result.map((i) => new ProviderModel({
          provider: i,
          resume: []
        }));
        commit('setProviders', providers);
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
    providers: [],
  },

  getters: {
    getProviders: (state) => state.providers,
  },

  mutations: {
    setProviders(state, value: ProviderModel[]) {
      state.providers = value;
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
