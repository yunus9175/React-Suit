import React from 'react'

interface ShimmerProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export function Shimmer({ width = '100%', height = '20px', borderRadius = '4px', className = '', style }: ShimmerProps) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--muted) 25%, color-mix(in oklab, var(--muted) 60%, transparent) 50%, var(--muted) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        willChange: 'background-position',
        ...style
      }}
    />
  )
}

export function ShimmerCard() {
  return (
    <div className="card shimmer-card" style={{
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: 12,
      background: "var(--surface)"
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "56%",
        overflow: "hidden",
        borderRadius: 6,
        background: "var(--muted)"
      }}>
        <Shimmer width="100%" height="100%" borderRadius="6px" />
      </div>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <Shimmer width="80%" height="16px" />
        <Shimmer width="100%" height="12px" style={{ marginTop: 4 }} />
        <Shimmer width="60%" height="12px" style={{ marginTop: 4 }} />
      </div>
    </div>
  )
}

export function ShimmerGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "16px"
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  )
}
