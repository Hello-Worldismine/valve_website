import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    badge: '신제품 출시',
    title: '정밀 선형 가이드\n최신 라인업',
    sub: '고속·고정밀 LM 가이드 시리즈\n당일 출하 가능 품목 대폭 확대',
    cta: '지금 보기',
    cta2: 'CAD 다운로드',
    bg: 'from-[#1a1a2e] to-[#16213e]',
    accent: '#cc0000',
    tag: 'LM 가이드',
    stat1: { v: '2,400+', l: '재고 품목' },
    stat2: { v: '익일', l: '배송 가능' },
  },
  {
    id: 2,
    badge: '한정 특가',
    title: '스테인리스\n볼 베어링',
    sub: 'SUS304 · SUS440C 소재\n내식성이 뛰어난 프리미엄 베어링',
    cta: '특가 확인',
    cta2: '전체 목록',
    bg: 'from-[#0f2027] to-[#203a43]',
    accent: '#e67e22',
    tag: '베어링',
    stat1: { v: '30%', l: '할인 적용' },
    stat2: { v: '5,000+', l: '규격 보유' },
  },
  {
    id: 3,
    badge: '무료 CAD 제공',
    title: '에어 실린더\n완벽 선택',
    sub: 'SMC·CKD·DSvalv 브랜드\n2D/3D CAD 무료 다운로드',
    cta: 'CAD 다운로드',
    cta2: '카탈로그 보기',
    bg: 'from-[#2d1b69] to-[#11998e]',
    accent: '#00b4d8',
    tag: 'FA 자동화',
    stat1: { v: '무료', l: 'CAD 제공' },
    stat2: { v: '48h', l: '납기 단축' },
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = (idx) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 500)
  }

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [current])

  const s = slides[current]

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${s.bg} transition-all duration-500`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 w-full py-8 sm:py-10 md:py-0 md:min-h-[480px] flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full">

            {/* Text content */}
            <div className={`flex-1 text-white transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: s.accent }}>
                  {s.badge}
                </span>
                <span className="text-xs text-white/50 font-medium tracking-wider uppercase">{s.tag}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 sm:mb-4 tracking-tight whitespace-pre-line">
                {s.title}
              </h1>
              <p className="text-white/70 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 leading-relaxed whitespace-pre-line">{s.sub}</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg" style={{ background: s.accent }}>
                  {s.cta}
                </button>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-all">
                  {s.cta2}
                </button>
              </div>
              {/* Stats */}
              <div className="flex gap-6 mt-6 pt-4 sm:mt-8 sm:pt-6 border-t border-white/10">
                <div>
                  <div className="text-xl sm:text-2xl font-black" style={{ color: s.accent }}>{s.stat1.v}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.stat1.l}</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-xl sm:text-2xl font-black" style={{ color: s.accent }}>{s.stat2.v}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.stat2.l}</div>
                </div>
              </div>
            </div>

            {/* Visual block — 모바일에서 작게 */}
            <div className={`w-full sm:w-[320px] md:w-[380px] lg:w-[440px] flex-shrink-0 transition-all duration-500 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="aspect-[4/3] flex items-center justify-center p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                        style={{
                          background: i === 4 ? s.accent : 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: i === 4 ? '24px' : '18px',
                        }}
                      >
                        {['⚙️','🔩','⚡','🔧','🏭','📐','🔬','⛽','🔌'][i]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 sm:px-5 pb-3 sm:pb-4 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">품목 수</span>
                    <span className="text-white font-bold text-sm">80,000,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button onClick={() => go((current - 1 + slides.length) % slides.length)}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => go((current + 1) % slides.length)}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
