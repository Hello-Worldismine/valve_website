import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: '기계 부품',
    emoji: '⚙️',
    count: '15,000,000+',
    color: 'from-slate-700 to-slate-900',
    tags: ['베어링', 'LM 가이드', '체인·벨트', '기어', '커플링', '스프링'],
    hot: true,
  },
  {
    name: 'FA·자동화',
    emoji: '🏭',
    count: '8,000,000+',
    color: 'from-blue-700 to-blue-900',
    tags: ['에어실린더', '솔레노이드밸브', '전동 액추에이터', '센서'],
    hot: false,
  },
  {
    name: '전기·전자',
    emoji: '⚡',
    count: '12,000,000+',
    color: 'from-amber-600 to-orange-800',
    tags: ['스위치', '커넥터', 'LED', '전원장치', '케이블'],
    hot: false,
  },
  {
    name: '공구·측정',
    emoji: '🔧',
    count: '5,000,000+',
    color: 'from-green-700 to-emerald-900',
    tags: ['절삭 공구', '측정기', '수공구', '작업용품'],
    hot: false,
  },
  {
    name: '소재·원자재',
    emoji: '🔩',
    count: '10,000,000+',
    color: 'from-purple-700 to-purple-900',
    tags: ['금속 판재', '봉재', '수지판', '고무·스폰지'],
    hot: true,
  },
  {
    name: '배관·유체',
    emoji: '⛽',
    count: '3,000,000+',
    color: 'from-cyan-700 to-teal-900',
    tags: ['파이프·튜브', '피팅', '밸브', '펌프'],
    hot: false,
  },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-[#cc0000] uppercase tracking-widest mb-1">Categories</p>
          <h2 className="text-2xl font-black text-gray-900">상품 카테고리</h2>
          <p className="text-sm text-gray-500 mt-1">8억 개 이상의 부품을 한 번에 검색하세요</p>
        </div>
        <a href="#" className="hidden md:flex items-center gap-1 text-sm text-[#cc0000] hover:underline font-medium">
          전체 카테고리 <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
            className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-white overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-xl`}
          >
            {cat.hot && (
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                인기
              </span>
            )}
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
              {cat.emoji}
            </div>
            <div className="font-black text-lg leading-tight mb-1">{cat.name}</div>
            <div className="text-white/60 text-xs mb-3">{cat.count} 품목</div>
            <div className="flex flex-wrap gap-1.5">
              {cat.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[10px] bg-white/15 rounded-full px-2 py-0.5 text-white/80">
                  {t}
                </span>
              ))}
            </div>
            <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <ArrowRight size={13} />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
