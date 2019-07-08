<template>
  <section class="section">
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else>
      <div class="container">
        <div class="level is-flex-touch">
          <button class="button is-large" aria-label="前の月を表示" @click="DisplayLastMonth">
            <b-icon icon="arrow-left-bold" size="is-small"></b-icon>
          </button>
          <p class="title">{{ year }}年 {{ month }}月</p>
          <button class="button is-large" aria-label="次の月を表示" @click="DisplayNextMonth">
            <b-icon icon="arrow-right-bold" size="is-small"></b-icon>
          </button>
        </div>

        <table class="table is-fullwidth is-narrow is-bordered">
          <thead>
            <tr>
              <th v-for="(day, index) in days" :key="index" class="has-text-centered">
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, key) in weekList" :key="key">
              <td
                v-for="(date, idx) in week.week"
                :key="idx"
                class="has-text-centered"
                :class="{ 'has-text-weight-bold': date.isToday }"
              >
                <template v-if="date.isTargetMonth">
                  <p class="is-size-5">{{ date.date }}</p>
                  <Tag v-if="date.isRareMedal" :class="`has-background-info`">レアメ</Tag>
                  <Tag v-if="date.isMaterial" :class="`has-background-success`">素材</Tag>
                  <Tag v-if="date.isRaid" :class="`has-background-warning`">レイド</Tag>
                  <Tag v-if="date.isRoar" :class="`has-background-danger`">爆走</Tag>
                  <Tag v-if="date.isAdvent" :class="`has-background-danger`">降臨</Tag>
                  <Tag v-if="date.isMagicalBook" :class="`has-background-notice`">絵本</Tag>
                  <p class="is-size-6">{{ date.weapon }}</p>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Event from '~/lib/Event.ts'
import { EventType } from '~/lib/EventType.ts'
import Tag from '~/components/Tag.vue'

interface IData {
  today: Date
  days: string[]
  year: number
  month: number
  weekList: object[]
  eventList: Event[] | undefined
  isLoading: boolean
}

const today = new Date()

export default Vue.extend({
  components: {
    Tag
  },
  data(): IData {
    return {
      today: today,
      days: ['日', '月', '火', '水', '木', '金', '土'],
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      weekList: [],
      eventList: undefined,
      isLoading: true
    }
  },
  watch: {
    eventList: function() {
      this.weekList = this.CreateWeekList(this.year, this.month, this.eventList)
    }
  },
  created() {
    this.GetEventList().then(result => {
      if (result !== undefined) {
        this.eventList = result
      }
    })
    this.weekList = this.CreateWeekList(this.year, this.month, this.eventList)
    this.isLoading = false
  },
  methods: {
    DisplayNextMonth: function() {
      if (this.month === 12) {
        this.month = 1
        this.year += 1
      } else {
        this.month += 1
      }
      this.weekList = this.CreateWeekList(this.year, this.month, this.eventList)
    },
    DisplayLastMonth: function() {
      if (this.month === 1) {
        this.month = 12
        this.year -= 1
      } else {
        this.month -= 1
      }
      this.weekList = this.CreateWeekList(this.year, this.month, this.eventList)
    },
    CreateWeekList(targetYear: number, targetMonth: number, eventList?: Event[]) {
      const weaponList = ['突･銃', '打･弓', '斬･銃', '突･弓', '打･魔', '斬･弓', '突･魔', '打･銃', '斬･魔']
      const date = this.GetStartDate(targetYear, targetMonth)
      let index = this.GetFirstWeaponIndex(date)
      let row: object[] = []
      const week: object[] = []

      const targetEventList = this.GetTargetEventList(targetYear, targetMonth, eventList)

      while (true) {
        const isToday =
          this.today.getFullYear() === date.getFullYear() &&
          this.today.getMonth() === date.getMonth() &&
          this.today.getDate() === date.getDate()

        const isTargetMonth = date.getMonth() + 1 === targetMonth
        const isRareMedal = this.IsActiveEvent(date, EventType.RareMedal, targetEventList)
        const isMaterial = this.IsActiveEvent(date, EventType.Material, targetEventList)
        const isRaid = this.IsActiveEvent(date, EventType.Raid, targetEventList)
        const isRoar = this.IsActiveEvent(date, EventType.Roar, targetEventList)
        const isAdvent = this.IsActiveEvent(date, EventType.Advent, targetEventList)
        const isMagicalBook = this.IsActiveEvent(date, EventType.MagicalBook, targetEventList)

        row.push({
          date: date.getDate(),
          day: date.getDay(),
          weapon: weaponList[index],
          isRareMedal,
          isMaterial,
          isRaid,
          isRoar,
          isAdvent,
          isToday,
          isTargetMonth,
          isMagicalBook
        })
        date.setDate(date.getDate() + 1)
        index = this.GetNextWeaponIndex(index)

        if (date.getDay() === 0) {
          week.push({ week: row })
          row = []

          if (date.getMonth() + 1 !== targetMonth) break
        }
      }
      return week
    },
    GetStartDate(year: number, month: number): Date {
      const date: Date = new Date(year + '/' + month + '/' + '01')

      // カレンダーの開始日が日曜日になるように、月の開始日から曜日を引く
      date.setDate(date.getDate() - date.getDay())
      return date
    },
    GetFirstWeaponIndex(date: Date): number {
      const baseDate = new Date('2018/12/2')
      const diff = date.getTime() - baseDate.getTime()
      const diffDay = diff / (1000 * 60 * 60 * 24)
      let index = diffDay % 9

      // 差分がマイナスの場合はプラスになるように調整
      if (index < 0) index += 9

      return index
    },
    GetTargetEventList(year: number, month: number, eventList?: Event[]) {
      if (eventList === undefined) return undefined

      const targetMonth = year.toString() + month.toString().padStart(2, '0')
      return eventList.filter(element => element.month === targetMonth)
    },
    GetNextWeaponIndex(index: number) {
      if (index === 8) return 0

      return index + 1
    },
    IsActiveEvent(date: Date, eventType: EventType, targetEventList?: Event[]) {
      if (targetEventList === undefined) return false

      const event = targetEventList.find(element => element.type === eventType)
      if (event === undefined) return false

      if (event.startDate <= date.getDate() && date.getDate() <= event.endDate) return true

      return false
    },
    async GetEventList() {
      const url = 'https://script.google.com/macros/s/AKfycbwdFst2WSgIFv70mkmVtaVsx4ygVgVJfXZeWaBvgt7wkD0hzaGQ/exec'
      const response = await axios.get<Array<Event>>(url)
      if (response.status !== 200) return

      const eventList = await response.data
      return eventList
    }
  }
})
</script>

<style scoped>
.section {
  padding: 1.5rem 0.2rem;
}

.table.is-narrow td {
  padding: 0.25rem 0rem;
}
</style>
