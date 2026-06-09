import { Truck, Download, Headphones, Shield, Zap, Award } from 'lucide-react'

const features = [
  { icon: Truck, title: '당일 출하', desc: '오후 5시 이전 주문', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Zap, title: '익일 배송', desc: '전국 빠른 배송', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Download, title: '무료 CAD', desc: '2D/3D 도면 제공', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Shield, title: '품질 보증', desc: '정품 보장', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Headphones, title: '전문 상담', desc: '기술 지원 가능', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: Award, title: '80억+ 품목', desc: '국내 최대 규모', color: 'text-indigo-600', bg: 'bg-indigo-50' },
]

export default function FeatureStrip() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* 모바일: 2열 그리드, 태블릿+: 6열 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-100">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex flex-row md:flex-col items-center gap-3 px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={17} className={color} />
              </div>
              <div className="text-left md:text-center">
                <div className="text-xs font-bold text-gray-800">{title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
