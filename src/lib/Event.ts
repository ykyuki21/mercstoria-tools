import { EventType } from '~/lib/EventType.ts'

export default class Event{
  month!: string
  type!: EventType
  startDate!: number
  endDate!: number
}