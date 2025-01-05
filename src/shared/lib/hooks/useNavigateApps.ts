import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import { AppsLinkType } from "@/shared/api/apps"

export const useNavigateApps = () => {
  const navigate = useNavigate()

  return useCallback(
    (href: string, type: AppsLinkType | string) => {
      if (type === AppsLinkType.TG_LINK) {
        window.Telegram.WebApp.openTelegramLink(href)
      } else if (type === AppsLinkType.INTERNAL_LINK) {
        navigate(href)
      } else {
        window.open(href, "_blank")
      }
    },
    [ navigate ]
  )
}