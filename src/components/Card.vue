<template>
  <div class="columns">
    <div class="column">
      <nuxt-link :to="{ name: item.component }">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title has-text-link">
              {{ item.title }}
            </p>
          </header>
          <div class="card-content">
            <p class="content has-text-centered">{{ item.description }}</p>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IPage } from '~/lib/Pages'

@Component
export default class Card extends Vue {
  @Prop() item!: IPage
}
</script>
