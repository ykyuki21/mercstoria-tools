<template>
  <section class="section">
    <div class="container">
      <card v-for="(item, key) of items" :key="key" :item="item"> </card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Card from '~/components/Card.vue'
import { pages } from '~/lib/Pages'

@Component({
  components: {
    Card
  }
})
export default class HomePage extends Vue {
  items = pages
}
</script>
