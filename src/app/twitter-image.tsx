import { renderSocialImage } from "@/lib/social-image";

export const alt = "Suraj Singh — AI Developer & Full-Stack Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return renderSocialImage();
}
