import { ImageResponse } from "next/og";

export const alt = "Suraj Singh frontend portfolio";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(15,157,154,0.45), transparent 28%), radial-gradient(circle at bottom right, rgba(255,122,24,0.42), transparent 30%), linear-gradient(135deg, #07111f 0%, #0b1628 55%, #111827 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "system-ui",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: 24,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)"
            }}
          >
            <div
              style={{
                height: 56,
                width: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "white",
                color: "#07111f",
                fontSize: 24,
                fontWeight: 700
              }}
            >
              SS
            </div>
            Scroll Storytelling Portfolio
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: 880 }}>
            <div style={{ fontSize: 78, lineHeight: 1.02, fontWeight: 700 }}>
              Suraj Singh
            </div>
            <div style={{ fontSize: 38, lineHeight: 1.2, color: "rgba(255,255,255,0.78)" }}>
              Frontend / Full-Stack Engineer building premium motion-first web experiences.
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px" }}>
            {["GSAP", "Next.js", "React", "Production UI"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "12px 20px",
                  fontSize: 24
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
