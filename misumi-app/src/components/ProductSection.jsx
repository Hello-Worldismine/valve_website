import { useState } from 'react'
import { Heart, ShoppingCart, Star, Package } from 'lucide-react'
import { products } from '../data/products'

const tabs = ['추천 상품', '신규 입고', '특가 상품', '인기 급상승']

export default function ProductSection({ onProductClick }) {
  const [activeTab, setActiveTab] = useState(0)
  const [wished, setWished] = useState(new Set())

  const visible = products.filter(p => p.tab.includes(activeTab))

  return (
    <section className="max-w-[1280px] mx-auto px-4 pb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold text-[#cc0000] uppercase tracking-widest mb-1">Products</p>
          <h2 className="text-2xl font-black text-gray-900">상품 목록</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === i ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => onProductClick(p)}
          >
            {/* Image area */}
            <div className={`${p.color} aspect-square flex items-center justify-center relative`}>
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{p.emoji}</span>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setWished(ws => { const s = new Set(ws); s.has(p.id) ? s.delete(p.id) : s.add(p.id); return s })
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart size={14} className={wished.has(p.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>
              <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                {p.tags.map(tag => (
                  <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tag === '인기' ? 'bg-[#cc0000] text-white' : tag === '특가' ? 'bg-orange-500 text-white' : 'bg-black/70 text-white'}`}>
                    {tag === '당일출하' ? '⚡ 당일출하' : tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="text-[10px] text-gray-400 mb-0.5 font-medium">{p.brand}</div>
              <div className="text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{p.name}</div>
              <div className="text-[10px] text-gray-400 font-mono mb-2">{p.partNo}</div>

              <div className="flex items-center gap-1 mb-2">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                <span className="text-[10px] text-gray-400">({p.reviews})</span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-lg font-black text-gray-900">₩{p.price.min.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1">~</span>
                </div>
                <div className="text-[10px] text-gray-400">최소 {p.moq}{p.unit}</div>
              </div>

              <div className="flex items-center gap-1 mt-1 mb-3">
                <Package size={10} className="text-green-500" />
                <span className="text-[10px] text-green-600 font-medium">재고 {p.stock >= 9999 ? '충분' : `${p.stock}개`}</span>
              </div>

              <button
                onClick={e => { e.stopPropagation(); onProductClick(p) }}
                className="w-full bg-gray-900 hover:bg-[#cc0000] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingCart size={13} />
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-bold text-sm rounded-xl hover:bg-gray-800 hover:text-white transition-all">
          더보기
        </button>
      </div>
    </section>
  )
}
