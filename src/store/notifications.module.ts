import Vue from 'vue';
import {Module, ActionContext} from 'vuex';
import {RootState} from './types/common';
import {apiRequest} from './api-request.decorator';

export interface NotificationsState {
  notifications: any[];
}

class NotificationsApi {
  @apiRequest()
  public getNotifications({ commit }: ActionContext<NotificationsState, RootState>, payload: any): any  {
    return Vue.apiService.makeRequest({url: 'notifications/subscriptions', auth: true})
      .then((result: string[]) => {
        commit('setNotifications', result);
      });
  }
}

const notificationsApi = new NotificationsApi();

export const notificationsModule: Module<NotificationsState, RootState> = {
  namespaced: true,

  state: {
    notifications: [],
  },

  getters: {
    getNotifications: (state) => state.notifications,
  },

  mutations: {
    setNotifications(state, value: any[]) {
      state.notifications = value;
    },
  },

  actions: {
    requestNotifications: (...args) => notificationsApi.getNotifications(...args),
  },
};
