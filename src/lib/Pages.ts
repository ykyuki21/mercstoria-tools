export interface IPage {
  title: string
  to: { name: string }
}

export const pages: IPage[] = [
  {
    title: 'Calendar',
    to: { name: 'calendar' }
  }
]
