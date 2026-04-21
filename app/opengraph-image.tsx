import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
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
            "linear-gradient(135deg, #1c1917 0%, #2f2924 46%, #d7bb92 100%)",
          color: "#f7f4ee",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "32px",
            padding: "42px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#f0ddbb",
            }}
          >
            {siteConfig.name}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 860,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.08,
                fontWeight: 700,
              }}
            >
              Daily AI signals, implementation use cases, and business impact.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.45,
                color: "#e7dfd1",
              }}
            >
              A structured intelligence product with tracked signals, analyst-reviewed
              predictions, and research-to-business insight.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: "#f4ead8",
            }}
          >
            <div style={{ display: "flex" }}>Next.js 16 + Supabase + Drizzle</div>
            <div style={{ display: "flex" }}>Signals / Use Cases / Predictions</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
