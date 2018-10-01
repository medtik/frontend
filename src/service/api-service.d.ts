import {ApiService} from './api-service.plugin';

declare module "vue/types/vue" {

  interface VueConstructor {
    apiService: ApiService;
  }

  interface Vue {
    apiService: ApiService;
    $apiService: ApiService;
  }
}
