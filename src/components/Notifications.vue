<template>
  <v-container fluid fill-height>
    Notifications
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { Action, Getter } from 'vuex-class';

  @Component
  export default class Notifications extends Vue {
    @Getter('getNotifications', {namespace: 'notifications'}) public notifications: string;
    @Action('requestNotifications', {namespace: 'notifications'}) private requestNotifications: any;

    public mounted(): void {
      this.requestNotifications();
    }
  }
</script>

<style scoped>

</style>