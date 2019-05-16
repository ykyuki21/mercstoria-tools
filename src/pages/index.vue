<template>
  <section class="section">
    <div class="container">
      <card title="イベントカレンダー" component="calendar">
        <p>メルストで開催されているギルバト・降臨の武器特攻や、各種イベントを表示するカレンダーです。</p>
      </card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Card from '~/components/Card.vue'

@Component({
  components: {
    Card
  }
})
export default class HomePage extends Vue {}
</script>
