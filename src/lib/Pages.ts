export interface IPage {
  menu: string
  title: string
  component: string
  description: string
}

export const pages: IPage[] = [
  {
    menu: 'Calendar',
    title: 'イベントカレンダー',
    component: 'calendar',
    description: 'メルストで開催されているギルバト・降臨の武器特攻や、各種イベントを表示するカレンダーです。'
  }
]
