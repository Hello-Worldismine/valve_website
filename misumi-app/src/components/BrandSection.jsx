const brands = [
  { name: 'DSvalv', color: '#cc0000', bg: '#fff5f5' },
  { name: 'SMC', color: '#0056a2', bg: '#f0f7ff' },
  { name: 'NSK', color: '#1a1a1a', bg: '#f8f8f8' },
  { name: 'OMRON', color: '#e60012', bg: '#fff5f5' },
  { name: 'TSUBAKI', color: '#003087', bg: '#f0f4ff' },
  { name: 'THK', color: '#007bff', bg: '#f0f8ff' },
  { name: 'KEYENCE', color: '#e2000f', bg: '#fff5f5' },
  { name: 'PISCO', color: '#00599c', bg: '#f0f6ff' },
]

const notices = [
  { date: '2025.06.05', tag: '공지', text: '2025년 여름 카탈로그 발행 안내' },
  { date: '2025.06.03', tag: '이벤트', text: 'FA 자동화 부품 특가 프로모션 진행 (6/1~6/30)' },
  { date: '2025.05.28', tag: '신제품', text: '스테인리스 정밀 가이드 레일 신규 라인업 추가' },
  { date: '2025.05.20', tag: '안내', text: '부품 번호 체계 변경 안내 및 CAD 데이터 업데이트' },
]

export default function BrandSection() {
  return (
    <section className="bg-white py-10 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Brands */}
        <div className="mb-10">
          <p className="text-xs font-bold text-[#cc0000] uppercase tracking-widest mb-1">Brands</p>
          <h2 className="text-2xl font-black text-gray-900 mb-6">취급 브랜드</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {brands.map(b => (
              <a
                key={b.name}
                href="#"
                className="rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all p-4 flex items-center justify-center aspect-[3/2] group"
                style={{ background: b.bg }}
              >
                <span className="text-sm font-black tracking-tight group-hover:scale-105 transition-transform" style={{ color: b.color }}>
                  {b.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Notice & Banner grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Notices */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">공지사항</h3>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600">전체보기 →</a>
            </div>
            <div className="space-y-3">
              {notices.map((n, i) => (
                <a key={i} href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${n.tag === '이벤트' ? 'bg-orange-100 text-orange-700' : n.tag === '신제품' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {n.tag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 group-hover:text-[#cc0000] transition-colors truncate">{n.text}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{n.date}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="flex sm:flex-col gap-3">
            <a href="#" className="flex-1 bg-gradient-to-br from-[#cc0000] to-[#990000] rounded-2xl p-4 sm:p-5 text-white hover:opacity-90 transition-all group">
              <div className="text-2xl mb-2">📐</div>
              <div className="font-black text-base mb-1">CAD 무료 다운로드</div>
              <div className="text-white/70 text-xs leading-relaxed">2D/3D 도면을 무료로 다운로드하세요. 설계 시간을 획기적으로 단축!</div>
              <div className="mt-3 text-xs font-bold underline">바로가기 →</div>
            </a>
            <a href="#" className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white hover:opacity-90 transition-all">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-black text-base mb-1">부품 번호 검색</div>
              <div className="text-white/70 text-xs leading-relaxed">타사 부품 번호로 DSvalv 호환 부품을 빠르게 찾아보세요.</div>
              <div className="mt-3 text-xs font-bold underline">바로가기 →</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
