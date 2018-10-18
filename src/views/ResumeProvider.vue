<template>
  <v-layout>
    <v-flex>
      <v-card v-for="(provider, i) in providers" :key="provider + i">
        <v-card-title class="title">
          {{provider.name}}
        </v-card-title>
        <v-list two-line v-if="provider.resumes.length">
          <template v-for="(item, index) in provider.resumes">
            <v-list-tile
              :key="item.link"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  <a v-bind:href="item.link" target="_blank" rel="noopener">{{item.title}}</a>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  Last update: {{item.published}}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-switch v-model="item.enabled" v-on:change="toggleResume(item.identity)"></v-switch>
              </v-list-tile-action>
              <v-list-tile-action-text>
                Auto update {{ item.enabled ? 'enabled' : 'disabled ' }}
              </v-list-tile-action-text>
            </v-list-tile>
            <v-divider
              v-if="index !== provider.resumes.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </v-card>
      <v-card v-if="!providers.length && requestMade">
        <v-card-text>
          What are u doing here? U don`t even have any resumes.
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import {ProviderModel} from '../store/models/provider.model';
  const ProvidersModule = namespace('providers');

  @Component({})
  export default class ResumeProvider extends Vue {
    public requestMade: boolean = false;
    @Prop() public id!: string; // suppose it will be from route params

    @ProvidersModule.Getter('providers') public providers: ProviderModel[];
    @ProvidersModule.Action('getResumes') private getResumes;
    @ProvidersModule.Action('toggleResume') private toggleResume;

    public mounted(): void {
      this.getResumes()
        .finally(() => {
          this.requestMade = true;
        });
    }

    public toggle(id: string): void {
      this.toggleResume(id);
    }
  }
</script>

<style scoped>
  .title {
    text-transform: uppercase;
  }
</style>