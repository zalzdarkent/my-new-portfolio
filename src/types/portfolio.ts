import type { ThumbKind } from '../motion'

export type AppId = 'showcase' | 'notes' | 'credits'
export type IconKind = 'terminal' | 'note' | 'folder' | 'browser'
export type Lang = 'id' | 'en'

export const NAV_KEYS = ['Home', 'About', 'Skills', 'Experience', 'Education', 'Projects', 'Contact'] as const
export type Page = (typeof NAV_KEYS)[number]

export interface Win {
  id: AppId
  x: number
  y: number
  z: number
  min: boolean
  max?: boolean
  closing?: boolean
}

export type SkillLevel = 'Advanced' | 'Intermediate' | 'Beginner'

export interface SkillItem {
  name: string
  level: SkillLevel
  pct: number
  color: string
  note: string
}

export interface JobItem {
  when: string
  where: string
  role: string
  place: string
  itemsId: string[]
  itemsEn: string[]
}

export interface ProjectItem {
  id: number
  name: string
  cat: 'web' | 'ai' | 'iot' | 'fullstack'
  kind: ThumbKind
  hue: number
  tags: string[]
  shortDescId: string
  shortDescEn: string
  featuresId: string[]
  featuresEn: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface TestimonialItem {
  name: string
  role: string
  text: string
}

