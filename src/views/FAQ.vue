<template>
  <v-layout>
    <v-flex>
      <v-expansion-panel light>
        <v-expansion-panel-content>
          <div slot="header">FAQ #1</div>
          <v-card>
            <v-card-text>
              Question answer 1
            </v-card-text>
          </v-card>

        </v-expansion-panel-content>

        <v-expansion-panel-content>
          <div slot="header">FAQ #2</div>
          <v-card>
            <v-card-text>
              Question answer 2
            </v-card-text>
          </v-card>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class FAQ extends Vue {

  }
</script>
<style scoped>

</style>