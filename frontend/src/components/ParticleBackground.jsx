import React from 'react'

const ParticleBackground = () => {
  return (
    <div className="neo-bg" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      <div className="neo-blob neo-blob-1" />
      <div className="neo-blob neo-blob-2" />
      <div className="neo-blob neo-blob-3" />
      <div className="neo-blob neo-blob-4" />
      <div className="neo-blob neo-blob-5" />
      <div className="neo-radial-glow" />
      <div className="neo-grid-overlay" />

      <style>{`
        .neo-blob {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
        }

        .neo-blob-1 {
          width: 70vw;
          height: 70vw;
          max-width: 800px;
          max-height: 800px;
          top: -20%;
          left: -15%;
          background: radial-gradient(circle, rgba(26, 111, 181, 0.55) 0%, rgba(42, 157, 143, 0.25) 45%, transparent 70%);
          filter: blur(40px);
          animation: neoBlob1 22s ease-in-out infinite;
        }

        .neo-blob-2 {
          width: 60vw;
          height: 60vw;
          max-width: 700px;
          max-height: 700px;
          top: 10%;
          right: -10%;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.5) 0%, rgba(26, 111, 181, 0.2) 45%, transparent 70%);
          filter: blur(35px);
          animation: neoBlob2 28s ease-in-out infinite;
        }

        .neo-blob-3 {
          width: 50vw;
          height: 50vw;
          max-width: 600px;
          max-height: 600px;
          bottom: -15%;
          left: 20%;
          background: radial-gradient(circle, rgba(42, 157, 143, 0.5) 0%, rgba(201, 168, 76, 0.2) 45%, transparent 70%);
          filter: blur(35px);
          animation: neoBlob3 24s ease-in-out infinite;
        }

        .neo-blob-4 {
          width: 35vw;
          height: 35vw;
          max-width: 400px;
          max-height: 400px;
          top: 50%;
          left: 5%;
          background: radial-gradient(circle, rgba(26, 111, 181, 0.45) 0%, transparent 65%);
          filter: blur(30px);
          animation: neoBlob4 20s ease-in-out infinite;
        }

        .neo-blob-5 {
          width: 30vw;
          height: 30vw;
          max-width: 350px;
          max-height: 350px;
          top: 0%;
          left: 35%;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 65%);
          filter: blur(30px);
          animation: neoBlob5 26s ease-in-out infinite;
        }

        .neo-radial-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.07) 0%, transparent 55%);
          animation: neoRadialPulse 10s ease-in-out infinite;
        }

        .neo-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.5;
        }

        @keyframes neoBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(10%, 8%) scale(1.1) rotate(5deg); }
          50% { transform: translate(5%, 15%) scale(0.95) rotate(-3deg); }
          75% { transform: translate(-5%, 5%) scale(1.05) rotate(2deg); }
        }

        @keyframes neoBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(-12%, 6%) scale(1.12) rotate(-4deg); }
          50% { transform: translate(-8%, -10%) scale(0.92) rotate(3deg); }
          75% { transform: translate(4%, -4%) scale(1.06) rotate(-2deg); }
        }

        @keyframes neoBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(8%, -10%) scale(1.08) rotate(3deg); }
          50% { transform: translate(-6%, -5%) scale(1.15) rotate(-4deg); }
          75% { transform: translate(10%, 3%) scale(0.95) rotate(2deg); }
        }

        @keyframes neoBlob4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15%, -8%) scale(1.25); }
          66% { transform: translate(-8%, 12%) scale(0.85); }
        }

        @keyframes neoBlob5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-10%, 12%) scale(1.15); }
          50% { transform: translate(8%, 6%) scale(0.9); }
          75% { transform: translate(3%, -10%) scale(1.1); }
        }

        @keyframes neoRadialPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default ParticleBackground
