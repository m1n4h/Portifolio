import React from 'react'

const SectionBackground = ({ variant = 'default' }) => {
  const colors = {
    default: {
      blob1: 'rgba(26, 111, 181, 0.2)',
      blob2: 'rgba(42, 157, 143, 0.18)',
      blob3: 'rgba(201, 168, 76, 0.15)',
    },
    warm: {
      blob1: 'rgba(201, 168, 76, 0.2)',
      blob2: 'rgba(26, 111, 181, 0.18)',
      blob3: 'rgba(42, 157, 143, 0.15)',
    },
    cool: {
      blob1: 'rgba(42, 157, 143, 0.2)',
      blob2: 'rgba(26, 111, 181, 0.18)',
      blob3: 'rgba(201, 168, 76, 0.15)',
    },
  }

  const darkColors = {
    default: {
      blob1: 'rgba(26, 111, 181, 0.3)',
      blob2: 'rgba(42, 157, 143, 0.25)',
      blob3: 'rgba(201, 168, 76, 0.2)',
    },
    warm: {
      blob1: 'rgba(201, 168, 76, 0.3)',
      blob2: 'rgba(26, 111, 181, 0.25)',
      blob3: 'rgba(42, 157, 143, 0.2)',
    },
    cool: {
      blob1: 'rgba(42, 157, 143, 0.3)',
      blob2: 'rgba(26, 111, 181, 0.25)',
      blob3: 'rgba(201, 168, 76, 0.2)',
    },
  }

  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  const c = isDark ? (darkColors[variant] || darkColors.default) : (colors[variant] || colors.default)

  return (
    <div className="section-bg" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <div className="section-blob section-blob-1" style={{
        background: `radial-gradient(circle, ${c.blob1} 0%, transparent 65%)`,
      }} />
      <div className="section-blob section-blob-2" style={{
        background: `radial-gradient(circle, ${c.blob2} 0%, transparent 65%)`,
      }} />
      <div className="section-blob section-blob-3" style={{
        background: `radial-gradient(circle, ${c.blob3} 0%, transparent 65%)`,
      }} />
      <style>{`
        .section-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          will-change: transform;
        }
        .section-blob-1 {
          width: 45vw;
          height: 45vw;
          max-width: 500px;
          max-height: 500px;
          top: -8%;
          right: -5%;
          animation: sBlob1 25s ease-in-out infinite;
        }
        .section-blob-2 {
          width: 40vw;
          height: 40vw;
          max-width: 450px;
          max-height: 450px;
          bottom: -8%;
          left: -5%;
          animation: sBlob2 30s ease-in-out infinite;
        }
        .section-blob-3 {
          width: 30vw;
          height: 30vw;
          max-width: 350px;
          max-height: 350px;
          top: 35%;
          left: 25%;
          animation: sBlob3 20s ease-in-out infinite;
        }
        @keyframes sBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-8%, 5%) scale(1.08) rotate(3deg); }
          66% { transform: translate(4%, -6%) scale(0.95) rotate(-2deg); }
        }
        @keyframes sBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(6%, -4%) scale(1.12) rotate(-3deg); }
          66% { transform: translate(-5%, 8%) scale(0.92) rotate(2deg); }
        }
        @keyframes sBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -5%) scale(1.15); }
        }
      `}</style>
    </div>
  )
}

export default SectionBackground
