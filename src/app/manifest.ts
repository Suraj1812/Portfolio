import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff9ef",
    theme_color: "#ffe45e",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any"
      }
    ]
  };
}
