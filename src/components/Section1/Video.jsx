import { useEffect, useRef } from 'react'
import WebGLScene from './WebGLScene'
import CurvedLoop from './CurvedLoop'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Bebas+Neue&display=swap');

  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(60px, 12vw, 140px);
    letter-spacing: 0.22em;
    color: #fff;
    line-height: 1;
  }
  .hero-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(13px, 1.5vw, 17px);
    letter-spacing: 0.25em;
    color: rgba(255,255,255,0.5);
  }
  @keyframes fade-up {
    from { opacity:0; transform:translateY(50px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes scan { from { transform:translateY(0) } to { transform:translateY(120px) } }
  @keyframes pulse-dot {
    0%,100% { opacity:.5; transform:scale(1); }
    50%      { opacity:1;  transform:scale(1.6); }
  }
`

export default function VideoHero() {
  const vidRef  = useRef()
  const wglRef  = useRef()
  const txtRef  = useRef()

  useEffect(() => {
    const vid = vidRef.current
    const wgl = wglRef.current
    const txt = txtRef.current

    // entry
    vid.animate(
      [{ filter:'blur(10px) brightness(.6)' }, { filter:'blur(0) brightness(1)' }],
      { duration:2000, delay:500, easing:'cubic-bezier(.16,1,.3,1)', fill:'forwards' }
    )

    // scroll scrub
    const scrub = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 1.2))
      vid.style.transform = `scale(${1 + p * 0.22})`
      vid.style.filter    = p > .7 ? `blur(${(p-.7)*20}px)` : ''
      vid.style.opacity   = p > .65 ? Math.max(0, 1-(p-.65)*3) : 1
      wgl.style.opacity   = p > .65 ? Math.min(1, (p-.65)*3.5) : 0
      txt.style.opacity   = p > .45 ? Math.max(0, 1-(p-.45)*4) : 1
      txt.style.transform = `translateY(${-p * 70}px)`
    }
    window.addEventListener('scroll', scrub, { passive:true })
    return () => window.removeEventListener('scroll', scrub)
  }, [])

  return (
    <>
      <style>{css}</style>

      {/* scroll room */}
      <div style={{ height:'260vh' }}>
        <div ref={vidRef.current ? undefined : undefined}
          style={{ position:'sticky', top:0, height:'100svh', overflow:'hidden', background:'#06050a' }}
        >

          {/* video */}
          <video ref={vidRef} autoPlay muted loop playsInline src="/hero.mp4"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', transformOrigin:'center', willChange:'transform,filter',
              filter:'blur(10px) brightness(.6)' }}
          />

          {/* webgl crossfade */}
          <div ref={wglRef} style={{ position:'absolute', inset:0, opacity:0, zIndex:1 }}>
            <WebGLScene />
          </div>

          {/* colour grade */}
          <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
            background:'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(4,3,8,.8) 100%)' }} />

          {/* scanlines */}
          <div style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
            backgroundImage:'repeating-linear-gradient(0deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 1px,transparent 1px,transparent 3px)',
            animation:'scan 7s linear infinite' }} />

          {/* bottom + top fade */}
          <div style={{ position:'absolute', inset:0, zIndex:4, pointerEvents:'none',
            background:'linear-gradient(to bottom, rgba(6,5,10,.55) 0%, transparent 18%, transparent 72%, rgba(6,5,10,.75) 100%)' }} />

          {/* content */}
          <div ref={txtRef} style={{ position:'absolute', inset:0, zIndex:10, display:'flex',
            flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>

            {/* live badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:28,
              border:'1px solid rgba(255,255,255,.12)', borderRadius:999, padding:'5px 16px',
              backdropFilter:'blur(10px)', background:'rgba(255,255,255,.04)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#d4a96a',
                animation:'pulse-dot 2.4s ease-in-out infinite' }} />
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11,
                letterSpacing:'0.22em', color:'rgba(255,255,255,.45)', textTransform:'uppercase' }}>
                Accepting bookings
              </span>
            </div>

            <h1 className="hero-title"
              style={{ animation:'fade-up .001s .001s both' }} /* real anim via Web API above */>
              ORION BLACK
            </h1>

            <div style={{ width:44, height:1, margin:'18px auto',
              background:'linear-gradient(90deg,transparent,rgba(212,169,106,.6),transparent)' }} />

            <p className="hero-sub">Stories Written in Color</p>

            <button
              style={{ marginTop:36, padding:'12px 34px', fontFamily:"'Cormorant Garamond',serif",
                fontStyle:'italic', fontSize:14, letterSpacing:'0.18em', color:'rgba(255,255,255,.7)',
                background:'transparent', border:'1px solid rgba(255,255,255,.18)', borderRadius:999,
                cursor:'pointer', backdropFilter:'blur(8px)', transition:'all .3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(212,169,106,.6)' }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,.7)'; e.currentTarget.style.borderColor='rgba(255,255,255,.18)' }}
            >
              View Portfolio
            </button>
          </div>

          {/* scroll hint */}
          <div style={{ position:'absolute', bottom:96, left:'50%', transform:'translateX(-50%)',
            zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic',
              fontSize:10, letterSpacing:'0.3em', color:'rgba(255,255,255,.25)', textTransform:'uppercase' }}>scroll</span>
            <div style={{ width:1, height:36, background:'linear-gradient(to bottom,rgba(255,255,255,.3),transparent)' }} />
          </div>

          {/* corner labels */}
          {[['© 2025',{top:20,left:24}],['est. mmxxi',{top:20,right:24}]].map(([t,s]) => (
            <span key={t} style={{ position:'absolute', ...s, zIndex:10,
              fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic',
              fontSize:10, letterSpacing:'0.2em', color:'rgba(255,255,255,.22)', textTransform:'uppercase' }}>{t}</span>
          ))}

          {/* marquee */}
          <div style={{ position:'absolute', bottom:0, left:0, width:'100%', zIndex:10 }}>
            <CurvedLoop
              marqueeText="ORION BLACK • TATTOO • IDENTITY • ART • TRANSFORMATION • "
              className="w-screen fill-[#E6EDF7] opacity-[0.35] text-[28px] sm:text-[44px] md:text-6xl font-black uppercase italic"
              speed={1.5}
            />
          </div>

        </div>
      </div>
    </>
  )
}