import Vue from 'vue';
import {Route, RawLocation} from 'vue-router';

export function authGuard(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void): void {
  if (to.matched.some((record) => record.meta.auth)) {
    if (localStorage.getItem('token') == null) {
      next({
        name: 'login',
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  }
}
