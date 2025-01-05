export enum AppsLinkType {
  TG_LINK = "TG",
  INTERNAL_LINK = "INTERNAL_LINK"
}

export interface Banner {
  background: string
  logo: string
  title: string
  description: string
  type: AppsLinkType | string
  link?: string
}

export interface App {
  title: string
  description: string
  logo: string
  category: string[]
  type: AppsLinkType | string
  link?: string
}