import React, { useMemo } from 'react'

const ParticleBackground = ({ count = 50 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  }, [count])

  return (
    <div className="particle-background" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(201, 168, 76, ${p.opacity}) 0%, transparent 70%)`,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-10px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(5px) scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default ParticleBackground
