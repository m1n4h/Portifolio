import React from 'react'

const SectionBackground = ({ variant = 'default' }) => {
  const colors = {
    default: {
      blob1: 'rgba(26, 111, 181, 0.25)',
      blob2: 'rgba(42, 157, 143, 0.2)',
      blob3: 'rgba(201, 168, 76, 0.18)',
    },
    warm: {
      blob1: 'rgba(201, 168, 76, 0.25)',
      blob2: 'rgba(26, 111, 181, 0.2)',
      blob3: 'rgba(42, 157, 143, 0.18)',
    },
    cool: {
      blob1: 'rgba(42, 157, 143, 0.25)',
      blob2: 'rgba(26, 111, 181, 0.2)',
      blob3: 'rgba(201, 168, 76, 0.18)',
    },
  }

  const c = colors[variant] || colors.default

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        top: '-10%',
        right: '-5%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.blob1} 0%, transparent 65%)`,
        filter: 'blur(50px)',
        animation: 'sectionBlob1 25s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        bottom: '-10%',
        left: '-5%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.blob2} 0%, transparent 65%)`,
        filter: 'blur(50px)',
        animation: 'sectionBlob2 30s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '40%',
        left: '30%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.blob3} 0%, transparent 65%)`,
        filter: 'blur(40px)',
        animation: 'sectionBlob3 20s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes sectionBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 40px) scale(1.1); }
          66% { transform: translate(30px, -50px) scale(0.95); }
        }
        @keyframes sectionBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -30px) scale(1.15); }
          66% { transform: translate(-40px, 60px) scale(0.9); }
        }
        @keyframes sectionBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, -40px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default SectionBackground
