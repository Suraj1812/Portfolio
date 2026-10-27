import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };

const INK = "#111111";
const CREAM = "#fff9ef";
const YELLOW = "#ffe45e";
const CYAN = "#63e6ff";
const MINT = "#85e2b4";
const LIME = "#b8ff5a";
const ORANGE = "#ff8a3d";
const BLUE = "#5b6cff";
const GRID = "rgba(17,17,17,0.07)";
/** Eight hard shadows around the glyphs read as an ink outline (Satori ignores text-stroke). */
const OUTLINE = [
  [3, 0], [-3, 0], [0, 3], [0, -3], [2.2, 2.2], [-2.2, 2.2], [2.2, -2.2], [-2.2, -2.2],
]
  .map(([x, y]) => `${x}px ${y}px 0 ${INK}`)
  .join(", ");

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file));

/**
 * Link preview card (WhatsApp, Slack, LinkedIn, X...). Drawn in the site's
 * neo-brutalist style: big two-line name, yellow role badge, skill chips and
 * a portrait card of Suraj's avatar on the right.
 */
export async function renderSocialImage() {
  const [display, bodySemi, bodyHeavy, avatar] = await Promise.all([
    asset("space-grotesk-latin-700-normal.woff"),
    asset("manrope-latin-600-normal.woff"),
    asset("manrope-latin-800-normal.woff"),
    asset("avatar.png"),
  ]);
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: CREAM,
        color: INK,
        fontFamily: "Manrope",
        overflow: "hidden",
      }}
    >
      {/* Graph-paper grid, like the site background (drawn as lines: Satori has no background-size). */}
      {Array.from({ length: 34 }, (_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: i * 36, width: 1.5, display: "flex", background: GRID }} />
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: i * 36, height: 1.5, display: "flex", background: GRID }} />
      ))}

      {/* Lime blob tucked into the bottom-right corner, under the card. */}
      <div
        style={{
          position: "absolute",
          right: -40,
          bottom: -36,
          width: 170,
          height: 110,
          display: "flex",
          borderRadius: 999,
          border: `5px solid ${INK}`,
          background: LIME,
          transform: "rotate(-18deg)",
        }}
      />

      {/* ---------- Left: name, role, skills ---------- */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 58,
          width: 640,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: `4px solid ${INK}`,
              background: YELLOW,
              boxShadow: `5px 5px 0 ${INK}`,
              fontFamily: "Space Grotesk",
              fontSize: 22,
            }}
          >
            SS
          </div>
          <div style={{ display: "flex", fontSize: 21, fontWeight: 800, letterSpacing: 4 }}>PORTFOLIO</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 26,
            fontFamily: "Space Grotesk",
            fontSize: 128,
            lineHeight: 0.92,
            letterSpacing: -5,
          }}
        >
          <div style={{ display: "flex" }}>SURAJ</div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ display: "flex", color: CREAM, textShadow: OUTLINE }}>SINGH</div>
            <div
              style={{
                width: 34,
                height: 34,
                marginLeft: 10,
                marginBottom: 18,
                display: "flex",
                borderRadius: 999,
                border: `4px solid ${INK}`,
                background: BLUE,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            marginTop: 30,
            padding: "14px 24px",
            borderRadius: 18,
            border: `5px solid ${INK}`,
            background: YELLOW,
            boxShadow: `9px 9px 0 ${INK}`,
            transform: "rotate(-2deg)",
            fontFamily: "Space Grotesk",
            fontSize: 31,
            letterSpacing: -0.5,
          }}
        >
          AI DEVELOPER
          <span style={{ color: ORANGE, margin: "0 14px" }}>×</span>
          FULL-STACK ENGINEER
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
          {[
            { label: "LLM apps", color: CYAN },
            { label: "AI automation", color: MINT },
            { label: "React + Next.js", color: "#ffffff" },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: `4px solid ${INK}`,
                background: color,
                boxShadow: `5px 5px 0 ${INK}`,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Right: portrait card ---------- */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 62,
          width: 390,
          height: 500,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 36,
          border: `6px solid ${INK}`,
          background: CYAN,
          boxShadow: `14px 14px 0 ${INK}`,
          transform: "rotate(2.5deg)",
        }}
      >
        {/* Sun disc behind the head. */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 75,
            width: 240,
            height: 240,
            display: "flex",
            borderRadius: 999,
            background: YELLOW,
            border: `5px solid ${INK}`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarSrc} width={440} height={418} alt="" style={{ position: "relative", marginBottom: -4 }} />
      </div>

      {/* Greeting sticker overlapping the card. */}
      <div
        style={{
          position: "absolute",
          right: 330,
          top: 92,
          display: "flex",
          padding: "12px 20px",
          borderRadius: 16,
          border: `4px solid ${INK}`,
          background: "#ffffff",
          boxShadow: `6px 6px 0 ${INK}`,
          transform: "rotate(-6deg)",
          fontFamily: "Space Grotesk",
          fontSize: 26,
        }}
      >
        Hey, I&apos;m Suraj!
      </div>

      {/* Orange star on the card's corner. */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 100 100"
        style={{ position: "absolute", right: 34, top: 18, transform: "rotate(12deg)" }}
      >
        <path
          d="M50 4 L62 37 L97 38 L69 59 L79 94 L50 73 L21 94 L31 59 L3 38 L38 37 Z"
          fill={ORANGE}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Manrope", data: bodySemi, weight: 600, style: "normal" },
        { name: "Manrope", data: bodyHeavy, weight: 800, style: "normal" },
      ],
    },
  );
}
