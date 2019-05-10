<template>
  <section class="section">
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else>
      <div class="level">
        <button class="button is-large" aria-label="前の月を表示" @click="DisplayLastMonth">
          <i class="fas fa-angle-double-left"></i>
        </button>
        <p class="title">{{ year }}年 {{ month }}月</p>
        <button class="button is-large" aria-label="次の月を表示" @click="DisplayNextMonth">
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>

      <div class="container">
        <div class="columns is-gapless">
          <div v-for="(day, index) in days" :key="index" class="has-text-centered column">
            <div class="has-background-light has-text-weight-bold box is-radiusless is-size-4">
              {{ day }}
            </div>
          </div>
        </div>
        <div>
          <div v-for="(week, key) in weekList" :key="key" class="columns is-gapless">
            <div
              v-for="(date, idx) in week.week"
              :key="idx"
              class="has-text-centered column box is-radiusless"
              :class="{ 'has-text-weight-bold': date.isToday }"
            >
              <template v-if="date.isTargetMonth">
                <div class="is-size-3">{{ date.date }}</div>
                <div>
                  <div class="level">
                    <template v-if="date.isRareMedal">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/raremedal.png" title="レアメダルウィーク" />
                        </figure>
                      </div>
                    </template>
                    <template v-if="date.isMaterial">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/material.png" title="マテリアルウィーク" />
                        </figure>
                      </div>
                    </template>
                    <template v-if="date.isRaid">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/raid.png" title="レイド" />
                        </figure>
                      </div>
                    </template>
                    <template v-if="date.isRoar">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/roar.png" title="爆走" />
                        </figure>
                      </div>
                    </template>
                    <template v-if="date.isAdvent">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/advent.png" title="降臨" />
                        </figure>
                      </div>
                    </template>
                    <template v-if="date.isMagicalBook">
                      <div class="level-item">
                        <figure class="image is-48x48">
                          <img src="images/magicalbook.png" title="絵本" />
                        </figure>
                      </div>
                    </template>
                    <!--<template v-if="!date.isAdvent">&nbsp;</template>-->
                  </div>
                </div>
                <div class="is-size-4">{{ date.weapon }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Event from '~/lib/Event.ts'
import { EventType } from '~/lib/EventType.ts'
import axios from 'axios'

@Component
export default class Calendar extends Vue {
  today = new Date()
  days = ['日', '月', '火', '水', '木', '金', '土']
  year = this.today.getFullYear()
  month = this.today.getMonth() + 1
  weekList: object[] = []
  eventList?: Event[] = undefined
  isLoading: boolean = true

  created() {
    this.GetEventList().then(result => {
      if (result !== undefined) {
        this.eventList = result
      }
    })
    this.weekList = this.CreateWeekList(this.year, this.month, this.eventList)
    this.isLoading = false
  }

  private CreateWeekList(targetYear: number, targetMonth: number, eventList?: Event[]) {
    const weaponList = ['突＆銃', '打＆弓', '斬＆銃', '突＆弓', '打＆魔', '斬＆弓', '突＆魔', '打＆銃', '斬＆魔']
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
  }

  private GetStartDate(year: number, month: number): Date {
    const date: Date = new Date(year + '/' + month + '/' + '01')

    // カレンダーの開始日が日曜日になるように、月の開始日から曜日を引く
    date.setDate(date.getDate() - date.getDay())
    return date
  }

  private GetFirstWeaponIndex(date: Date): number {
    const baseDate = new Date('2018/12/2')
    const diff = date.getTime() - baseDate.getTime()
    const diffDay = diff / (1000 * 60 * 60 * 24)
    let index = diffDay % 9

    // 差分がマイナスの場合はプラスになるように調整
    if (index < 0) index += 9

    return index
  }

  private GetTargetEventList(year: number, month: number, eventList?: Event[]) {
    if (eventList === undefined) return undefined

    const targetMonth = year.toString() + month.toString().padStart(2, '0')
    return eventList.filter(element => element.month === targetMonth)
  }

  private GetNextWeaponIndex(index: number) {
    if (index === 8) return 0

    return index + 1
  }

  private IsActiveEvent(date: Date, eventType: EventType, targetEventList?: Event[]) {
    if (targetEventList === undefined) return false

    const event = targetEventList.find(element => element.type === eventType)
    if (event === undefined) return false

    if (event.startDate <= date.getDate() && date.getDate() <= event.endDate) return true

    return false
  }

  private async GetEventList() {
    const url = 'https://script.google.com/macros/s/AKfycbwdFst2WSgIFv70mkmVtaVsx4ygVgVJfXZeWaBvgt7wkD0hzaGQ/exec'
    const response = await axios.get<Array<Event>>(url)
    if (response.status !== 200) return

    const eventList = await response.data
    return eventList
  }
}
</script>
