import { ImageResponse } from "next/og";

export const alt = "Suraj Singh neobrutalist portfolio";
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
          background: "#fff9ef",
          color: "#111111",
          padding: "48px",
          fontFamily: "system-ui",
          justifyContent: "space-between",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(17,17,17,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 42,
            right: 54,
            width: 120,
            height: 120,
            border: "6px solid #111111",
            borderRadius: 28,
            background: "#ff6ad5"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 54,
            left: 56,
            width: 96,
            height: 96,
            border: "6px solid #111111",
            borderRadius: 24,
            background: "#63e6ff"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            zIndex: 1
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
              color: "rgba(17,17,17,0.72)"
            }}
          >
            <div
              style={{
                height: 56,
                width: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                background: "#ffe45e",
                color: "#111111",
                fontSize: 24,
                fontWeight: 900,
                border: "4px solid #111111",
                boxShadow: "8px 8px 0 #111111"
              }}
            >
              SS
            </div>
            Neobrutalist Portfolio
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: 980 }}>
            <div style={{ fontSize: 78, lineHeight: 1.02, fontWeight: 900 }}>
              Suraj Singh
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 980,
                border: "6px solid #111111",
                borderRadius: 28,
                background: "#ffe45e",
                boxShadow: "14px 14px 0 #111111",
                padding: "22px 28px",
                fontSize: 34,
                lineHeight: 1.2,
                fontWeight: 800
              }}
            >
              Full-Stack Software Engineer | AI-Powered Applications | Building Scalable Web & AI Systems
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px" }}>
            {["Next.js", "React", "AI Products", "Scalable Systems"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  borderRadius: 999,
                  border: "4px solid #111111",
                  background: item === "AI Products" ? "#ff6ad5" : "#ffffff",
                  boxShadow: "8px 8px 0 #111111",
                  padding: "12px 20px",
                  fontSize: 24,
                  fontWeight: 800
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
