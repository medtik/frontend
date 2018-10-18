<template>
  <v-app>
    <GhFork/>
    <v-toolbar class="grey lighten-5">
      <v-toolbar-side-icon v-on:click="showSidebar = !showSidebar"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-3">
        <div v-on:click="toLogin()" style="cursor: pointer;">pushResume</div>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat v-on:click="toFAQ()">FAQ</v-btn>
        <v-menu offset-y v-if="isLogged && providersList.length">
          <v-btn flat slot="activator">
            Add account
          </v-btn>
          <v-list light>
            <v-list-tile
              v-for="(provider, index) in providersList"
              :key="index"
              @click="loginProvider(provider)"
            >
              <v-list-tile-title>{{ provider }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn v-on:click="logout()" v-if="isLogged" flat fab>
        <v-icon>power_settings_new</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      v-model="showSidebar"
      dark class="teal"
      absolute
      temporary
    >
      <Status column="true"/>
    </v-navigation-drawer>

    <v-content>
      <v-progress-linear class="loader" v-show="busy" :indeterminate="true" height="5" color="primary"></v-progress-linear>
      <v-container fluid fill-height>
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-content>

    <v-snackbar v-model="showError" :timeout="0">
      {{error}}
      <v-btn color="pink" flat v-on:click="closeError()">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
  import {Action, Getter, Mutation, namespace} from 'vuex-class';
  import {Component, Vue} from 'vue-property-decorator';
  import Status from './components/Status.vue';
  import GhFork from './components/GhFork.vue';
  import {router} from './router';
  import {ProviderModel} from './store/models/provider.model';

  const ProvidersModule = namespace('providers');

  @Component({
    components: {Status, GhFork}
  })
  export default class App extends Vue {
    @Getter('busy') public busy!: boolean;
    @Getter('error') public error!: boolean;
    @Getter('token') public token: string;
    @Getter('providerCode') public providerCode: string;
    @Mutation('setToken') private setToken: any;
    @Action('removeError') private removeError: any;
    @Action('refreshToken') private refreshToken: any;
    @Action('logout') private logout: any;
    @Action('getBackendVersion') private getBackendVersion: any;
    @ProvidersModule.Action('getProviders') private getProviders: any;
    @ProvidersModule.Getter('providersList') public providersList: string[];
    @ProvidersModule.Action('getProviderRedirect') private getProviderRedirect;

    public showSidebar: boolean = false;

    public get isLogged(): boolean {
      return !!this.token;
    }

    public get showError(): boolean {
      return !!this.error;
    }

    public closeError(): void {
      this.removeError();
    }

    public mounted(): void {
      this.getProviders();

      this.getBackendVersion()
        .then((result) => {
          if (!result) {
            this.logout();
          }
        });

      const token = localStorage.getItem('token');
      if (token) {
        this.setToken(token);
        this.refreshToken(token);
        router.push({name: 'resume'});
      }
    }

    loginProvider(provider: string): void {
      this.getProviderRedirect(provider);
    }

    toLogin(): void {
      if (this.isLogged) {
        router.push({name: 'resume'});
      } else {
        router.push({name: 'login'});
      }
    }

    toFAQ(): void {
      router.push({name: 'faq'});
    }
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: absolute;
    top: 0;
    margin: 0;
  }
</style>
