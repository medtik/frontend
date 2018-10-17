<template>
  <v-layout v-if="!busy" align-center justify-center>
    <div>
      <v-btn v-on:click="login(provider)" v-for="(provider, i) in providersList" :key="provider + i" large color="primary">{{provider}}</v-btn>
    </div>

  </v-layout>
  <v-layout align-center justify-center v-else>
    <v-progress-circular
      indeterminate
      color="primary"
      :size="100"
      :width="5"
    ></v-progress-circular>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import {ProviderModel} from '../store/models/provider.model';

const ProvidersModule = namespace('providers');

@Component({})
export default class Login extends Vue {
  busy: boolean = false;
  @ProvidersModule.Getter('providersList') public providersList: string[];
  @ProvidersModule.Action('getProviderRedirect') private getProviderRedirect;

  public login(provider: string): void {
    this.busy = true;
    this.getProviderRedirect(provider)
      .then((result) => this.busy = result);
  }
}
</script>
<style scoped>
  .v-btn--large {
    font-size: 30px;
    height: 88px;
  }
</style>