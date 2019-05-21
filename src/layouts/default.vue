<template>
  <div>
    <nav class="navbar header has-shadow is-primary is-spaced" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <nuxt-link to="/" class="navbar-item"><img src="~assets/buefy.png" alt="Buefy"/></nuxt-link>

          <b-dropdown hoverable class="navbar-item" aria-role="list">
            <button slot="trigger" class="button is-primary">
              <span>Menu</span>
              <b-icon icon="menu-down"></b-icon>
            </button>

            <b-dropdown-item has-link aria-role="listitem">
              <nuxt-link to="/">
                Home
              </nuxt-link>
            </b-dropdown-item>

            <b-dropdown-item v-for="(item, key) of items" :key="key" has-link aria-role="listitem">
              <nuxt-link :to="item.to">
                {{ item.title }}
              </nuxt-link>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>

    <section class="main-content">
      <nuxt />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pages } from '~/lib/Pages'

@Component
export default class Default extends Vue {
  items = pages
}
</script>
