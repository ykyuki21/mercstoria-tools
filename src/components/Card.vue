<template>
  <div class="columns">
    <div class="column">
      <nuxt-link :to="{ name: component }">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title has-text-link">
              {{ title }}
            </p>
          </header>
          <div class="card-content">
            <div class="content has-text-centered">
              <slot />
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Card extends Vue {
  @Prop(String) title!: string
  @Prop(String) component!: string
}
</script>
