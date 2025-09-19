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
        width:width+" !important",
        height:height+" !important",
        borderRadius:borderRadius+" !important",
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
      {/* Image shimmer - one large shimmer */}
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
      {/* Text shimmers - small lines */}
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <Shimmer width="100%" height="10px" style={{ marginTop: 4 }}  />
        <Shimmer width="100%" height="10px" style={{ marginTop: 4 }} />
        <Shimmer width="60%" height="10px" style={{ marginTop: 4 }} />
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
