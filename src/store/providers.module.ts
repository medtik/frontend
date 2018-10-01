import Vue from 'vue';
import {Module, ActionContext} from 'vuex';
import {RootState} from './types/common';
import {ProviderModel} from './models/provider.model';
import {IResume, ResumeModel} from './models/resume.model';
import {apiRequest} from './api-request.decorator';
import {IGetProviderRedirect, IGetProviderAuth, IToggleResume} from '../service/interfaces';
import {router} from '../router';

export interface ProvidersState {
  list: ProviderModel[];
  resumes: ResumeModel[];
}

class ProvidersApi {
  @apiRequest()
  public getProviders({ commit }: ActionContext<ProvidersState, RootState>, payload: any): any  {
    return Vue.apiService.makeRequest({url: 'auth/providers'})
      .then((result) => {
        commit('setList', result);
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
        const current = state.list.find((i) => i.name === provider);
        if (current) {
          current.logged = true;
          current.redirectUrl = result.redirect;
          commit('setList', state.list);
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
        router.push('../provider/' + provider);
        dispatch('refreshToken', result.token, {root: true});
      });
  }

  @apiRequest()
  public getResumes({ commit }: ActionContext<ProvidersState, RootState>, provider): any {
    return Vue.apiService.makeRequest({url: 'resume', auth: true})
      .then((result: IResume[]) => {
        const resumes = result.map((i) => new ResumeModel(i));
        commit('setResumes', resumes);
      });
  }

  @apiRequest()
  public toggleResume({ commit, state }: ActionContext<ProvidersState, RootState>, uniq): any {
    return Vue.apiService.makeRequest<IToggleResume>({url: 'resume', method: 'POST', auth: true, body: {uniq}})
      .then((result: IToggleResume) => {
        const current: ResumeModel = state.resumes.find((i: ResumeModel) => i.uniq === uniq);
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
    list: [],
    resumes: [],
  },

  getters: {
    list: (state) => state.list,
    resumes: (state) => state.resumes,
  },

  mutations: {
    setList(state, value: Array<string|ProviderModel>) {
      state.list = value.map((i) => new ProviderModel(i));
    },
    setResumes(state, value) {
      state.resumes = value;
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
