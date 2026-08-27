import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Eisenberg, Pocock, Warner, Wolfe & Berman — Rolling 4-Week Intelligence'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1228 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
            display: 'flex',
          }}
        />
        {/* Label */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: 4,
            color: '#7c3aed',
            textTransform: 'uppercase',
            marginBottom: 28,
            display: 'flex',
          }}
        >
          Blue Collar Appz Co.
        </div>
        {/* Main heading */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#f5f5f5',
            lineHeight: 1.1,
            marginBottom: 32,
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: 900,
          }}
        >
          Eisenberg, Pocock, Warner, Wolfe &amp; Berman
        </div>
        {/* Subheading */}
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Rolling 4-Week Founder Intelligence
        </div>
        {/* Pill tags */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['5 Founder Feeds', 'ACP Funnel', 'Skills Curriculum', '13-Slide Deck'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#c4b5fd',
                borderRadius: 999,
                padding: '8px 20px',
                fontSize: 18,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
