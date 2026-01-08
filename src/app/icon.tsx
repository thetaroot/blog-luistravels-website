import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1a1a1a',
        }}
      >
        {/* Simple HTG monogram */}
        <span>HTG</span>
      </div>
    ),
    {
      ...size,
    }
  )
}