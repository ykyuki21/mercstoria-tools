<template>
  <div class="root">
    <nav class="navbar header has-shadow is-primary is-spaced" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <nuxt-link to="/" class="navbar-item"><img src="~assets/yukimy.png" alt="Yukimy"/></nuxt-link>

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
              <nuxt-link :to="{ name: item.component }">
                {{ item.menu }}
              </nuxt-link>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>

    <section class="main-content">
      <nuxt />
    </section>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>© 2019 yuki</p>
      </div>
    </footer>
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

<style>
.root {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.footer {
  padding: 3rem 1.5rem;
}
</style>
