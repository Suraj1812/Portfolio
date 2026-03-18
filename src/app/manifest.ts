import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Suraj Singh | Frontend Portfolio",
    short_name: "Suraj Portfolio",
    description:
      "Scroll-storytelling portfolio for Suraj Singh featuring premium frontend engineering, animation systems, and production-ready project work.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any"
      }
    ]
  };
}
