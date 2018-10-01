<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-list two-line>
          <template v-for="(item, index) in resumes">
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
                <v-switch v-model="item.enabled" v-on:change="toggleResume(item.uniq)"></v-switch>
              </v-list-tile-action>
              <v-list-tile-action-text>
                Auto update {{ item.enabled ? 'enabled' : 'disabled ' }}
              </v-list-tile-action-text>
            </v-list-tile>
            <v-divider
              v-if="index !== resumes.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { Action, namespace } from 'vuex-class';

  const providersModule = namespace('providers');

  @Component({})
  export default class ResumeProvider extends Vue {
    @Prop() public id!: string; // suppose it will be from route params

    @providersModule.Getter('resumes') public resumes!: any;
    @Action('getResumes', {namespace: 'providers'}) private getResumes;
    @Action('toggleResume', {namespace: 'providers'}) private toggleResume;

    public mounted(): void {
      this.getResumes();
    }

    public toggle(id: string): void {
      this.toggleResume(id);
    }
  }
</script>