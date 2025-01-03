import { AppsLinkType, Banner } from "@/shared/api/apps";

import LOGO from "@/shared/lib/images/apps/apps-logo.png";
import BACKGROUND from "@/shared/lib/images/apps/banner-bg.png";

export const appsBannersMock: Banner[] = [
  {
    background: BACKGROUND,
    logo: LOGO,
    title: "Bearts",
    description: "Best company in the world",
    type: AppsLinkType.INTERNAL_LINK,
    link: ""
  },
  {
    background: BACKGROUND,
    logo: LOGO,
    title: "Bearts",
    description: "Best company in the world",
    type: AppsLinkType.INTERNAL_LINK,
    link: ""
  },
  {
    background: BACKGROUND,
    logo: LOGO,
    title: "Bearts",
    description: "Best company in the world",
    type: AppsLinkType.INTERNAL_LINK,
    link: ""
  }
]