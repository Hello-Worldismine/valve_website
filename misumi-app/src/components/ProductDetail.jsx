import { useState, useMemo } from 'react'
import {
  ChevronRight, Star, Download, Box, ShoppingCart,
  Heart, Share2, ChevronDown, ChevronUp,
  FileText, AlertCircle, Package, Truck, X,
  Search, GitCompare, CheckCircle2, Info,
  MessageSquare, PenLine, HelpCircle
} from 'lucide-react'

/* ── 수량별 할인 계산 ── */
function calcTierPrice(baseMin, qty) {
  if (qty >= 201) return Math.round(baseMin * 0.70)
  if (qty >= 101) return Math.round(baseMin * 0.75)
  if (qty >= 51)  return Math.round(baseMin * 0.80)
  if (qty >= 40)  return Math.round(baseMin * 0.80)
  if (qty >= 30)  return Math.round(baseMin * 0.85)
  if (qty >= 20)  return Math.round(baseMin * 0.90)
  return baseMin
}

const TIERS = [
  { range: '1~19',    mult: 1.00 },
  { range: '20~29',   mult: 0.90 },
  { range: '30~39',   mult: 0.85 },
  { range: '40~50',   mult: 0.80 },
  { range: '51~100',  mult: 0.80 },
  { range: '101~200', mult: 0.75 },
  { range: '201~',    mult: 0.70 },
]

function tierIndex(qty) {
  if (qty >= 201) return 6
  if (qty >= 101) return 5
  if (qty >= 51)  return 4
  if (qty >= 40)  return 3
  if (qty >= 30)  return 2
  if (qty >= 20)  return 1
  return 0
}

/* ── 외형도 SVG placeholder ── */
function DrawingSVG() {
  return (
    <svg viewBox="0 0 360 200" className="w-full max-w-[360px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hex head top view */}
      <polygon points="50,60 70,48 90,60 90,84 70,96 50,84" stroke="#333" strokeWidth="1.5" fill="#f0f0f0"/>
      <circle cx="70" cy="72" r="8" stroke="#333" strokeWidth="1" fill="white"/>
      <circle cx="70" cy="72" r="3" stroke="#333" strokeWidth="1" fill="#ddd"/>
      {/* Bolt side view */}
      <rect x="130" y="50" width="30" height="20" rx="2" stroke="#333" strokeWidth="1.5" fill="#e8e8e8"/>
      <rect x="145" y="50" width="4" height="10" fill="#ccc"/>
      {/* Shaft */}
      <rect x="150" y="70" width="14" height="80" stroke="#333" strokeWidth="1.5" fill="#e8e8e8"/>
      {/* Thread lines */}
      {[...Array(10)].map((_, i) => (
        <line key={i} x1="150" y1={76 + i * 7} x2="164" y2={76 + i * 7} stroke="#aaa" strokeWidth="0.7" strokeDasharray="3,2"/>
      ))}
      {/* Dimension lines */}
      <line x1="130" y1="160" x2="164" y2="160" stroke="#0066cc" strokeWidth="1"/>
      <line x1="130" y1="155" x2="130" y2="165" stroke="#0066cc" strokeWidth="1"/>
      <line x1="164" y1="155" x2="164" y2="165" stroke="#0066cc" strokeWidth="1"/>
      <text x="147" y="175" textAnchor="middle" fontSize="10" fill="#0066cc" fontFamily="sans-serif">L</text>

      <line x1="118" y1="70" x2="118" y2="150" stroke="#0066cc" strokeWidth="1"/>
      <line x1="113" y1="70" x2="123" y2="70" stroke="#0066cc" strokeWidth="1"/>
      <line x1="113" y1="150" x2="123" y2="150" stroke="#0066cc" strokeWidth="1"/>
      <text x="108" y="113" textAnchor="middle" fontSize="10" fill="#0066cc" fontFamily="sans-serif">ℓ</text>

      <line x1="150" y1="40" x2="164" y2="40" stroke="#333" strokeWidth="0.8"/>
      <line x1="150" y1="36" x2="150" y2="44" stroke="#333" strokeWidth="0.8"/>
      <line x1="164" y1="36" x2="164" y2="44" stroke="#333" strokeWidth="0.8"/>
      <text x="157" y="34" textAnchor="middle" fontSize="9" fill="#333" fontFamily="sans-serif">M×P</text>

      {/* Head width */}
      <line x1="130" y1="45" x2="160" y2="45" stroke="#333" strokeWidth="0.8"/>
      <line x1="130" y1="41" x2="130" y2="49" stroke="#333" strokeWidth="0.8"/>
      <line x1="160" y1="41" x2="160" y2="49" stroke="#333" strokeWidth="0.8"/>
      <text x="145" y="41" textAnchor="middle" fontSize="9" fill="#333" fontFamily="sans-serif">A</text>

      {/* Labels */}
      <text x="70" y="110" textAnchor="middle" fontSize="10" fill="#666" fontFamily="sans-serif">상면도</text>
      <text x="220" y="110" textAnchor="middle" fontSize="10" fill="#666" fontFamily="sans-serif">측면도</text>
    </svg>
  )
}

export default function ProductDetail({ product, onBack }) {
  const [selectedOptions, setSelectedOptions] = useState({})
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [expandedOption, setExpandedOption] = useState(null)
  const [searchValues, setSearchValues] = useState({})
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const totalOptions = product.options.length
  const confirmedCount = Object.keys(selectedOptions).filter(k => (selectedOptions[k] || []).length > 0).length
  const isConfirmed = confirmedCount === totalOptions

  const confirmedPartNo = useMemo(() => {
    if (!isConfirmed) return null
    const vals = product.options.map(opt => (selectedOptions[opt.name] || [])[0] || '').join('-')
    return `${product.partNo}-${vals.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase() || 'STD'}`
  }, [isConfirmed, selectedOptions, product])

  const unitPrice = calcTierPrice(product.price.min, qty)
  const totalPrice = unitPrice * qty
  const currentTierIdx = tierIndex(qty)

  const nextTierQty = [20, 30, 40, 51, 101, 201][currentTierIdx] ?? null
  const savingsIfNextTier = nextTierQty
    ? (unitPrice - calcTierPrice(product.price.min, nextTierQty)) * nextTierQty
    : 0

  const toggleOption = (optName, val) => {
    setSelectedOptions(prev => {
      const cur = prev[optName] || []
      return { ...prev, [optName]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
    })
  }
  const clearAll = () => setSelectedOptions({})

  const selectedCount = Object.values(selectedOptions).flat().length

  const handleAddCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return
    setReviews(prev => [{
      id: Date.now(),
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('ko-KR'),
      author: '익명 구매자',
    }, ...prev])
    setReviewText('')
    setReviewRating(0)
  }

  const tabs = ['외형도/규격표', '형번 리스트', '상세 정보', `상품문의(${reviews.length}건)`]

  /* ─── 형번 리스트 rows ─── */
  const partRows = product.options[0]?.values.slice(0, 5).flatMap(v1 =>
    (product.options[1]?.values.slice(0, 3) || ['']).map(v2 => ({
      partNo: `${product.partNo.split('-')[0]}${v1}-${v2}`,
      v1, v2,
      price: Math.round(product.price.min * (0.9 + Math.random() * 0.3)),
      ship: Math.random() > 0.5 ? '당일' : '5일~',
    }))
  ) ?? []

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          <button onClick={onBack} className="hover:text-[#cc0000] transition-colors">DSvalv HOME</button>
          {product.category.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight size={12} />
              <button className="hover:text-[#cc0000] transition-colors">{c}</button>
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium">{product.name}</span>
          </span>
        </div>
      </div>

      {/* 모바일 옵션 필터 버튼 */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${sidebarOpen ? 'border-[#cc0000] text-[#cc0000] bg-red-50' : 'border-gray-200 text-gray-700'}`}
        >
          <span>⚙️</span> 형번 옵션 선택
          {selectedCount > 0 && (
            <span className="bg-[#cc0000] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{selectedCount}</span>
          )}
          <ChevronDown size={14} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
        {isConfirmed && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600">
            <CheckCircle2 size={13} /> 확정됨
          </span>
        )}
      </div>

      {/* 모바일 사이드바 드로어 */}
      {sidebarOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <MobileSidebar
            product={product}
            selectedOptions={selectedOptions}
            toggleOption={toggleOption}
            clearAll={clearAll}
            confirmedCount={confirmedCount}
            totalOptions={totalOptions}
            isConfirmed={isConfirmed}
            expandedOption={expandedOption}
            setExpandedOption={setExpandedOption}
            searchValues={searchValues}
            setSearchValues={setSearchValues}
          />
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row gap-5">

          {/* ── Left sidebar (데스크탑만) ── */}
          <aside className="hidden md:block w-[200px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-[140px]">

              {/* Confirmed status */}
              <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${isConfirmed ? 'bg-green-50 border-green-200' : 'border-gray-100'}`}>
                <div className="flex items-center gap-1.5">
                  {isConfirmed
                    ? <CheckCircle2 size={14} className="text-green-600" />
                    : <span className="text-xs font-bold text-gray-500">{confirmedCount}/{totalOptions}</span>
                  }
                  <span className={`text-xs font-bold ${isConfirmed ? 'text-green-700' : 'text-gray-700'}`}>
                    {isConfirmed ? '확정 되었습니다' : '형번 옵션 선택'}
                  </span>
                </div>
                <button onClick={clearAll} className="text-[10px] text-[#cc0000] hover:underline font-medium">모두 해제</button>
              </div>

              {/* Candidate count */}
              {!isConfirmed && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                  <span className="text-[11px] text-blue-700 font-bold">
                    미확정 {product.id * 7 + 53}건의 후보
                  </span>
                </div>
              )}

              {/* Options */}
              <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                {product.options.map((opt) => {
                  const selected = selectedOptions[opt.name] || []
                  const isOpen = expandedOption === opt.name
                  const search = searchValues[opt.name] || ''
                  const filtered = opt.values.filter(v => v.toLowerCase().includes(search.toLowerCase()))

                  return (
                    <div key={opt.name}>
                      <button
                        onClick={() => setExpandedOption(isOpen ? null : opt.name)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-medium text-gray-700 truncate">{opt.name}</span>
                          {selected.length > 0 && (
                            <span className="flex-shrink-0 text-[9px] bg-[#cc0000] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                              {selected.length}
                            </span>
                          )}
                        </div>
                        {isOpen ? <ChevronUp size={12} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={12} className="text-gray-400 flex-shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="bg-gray-50 px-3 pb-3">
                          {selected.length > 0 && (
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] text-gray-400">{selected.length}개 선택됨</span>
                              <button
                                onClick={() => setSelectedOptions(p => ({ ...p, [opt.name]: [] }))}
                                className="text-[10px] text-red-400 hover:underline"
                              >해제</button>
                            </div>
                          )}
                          {opt.values.length > 5 && (
                            <input
                              type="text"
                              placeholder="텍스트 검색"
                              value={search}
                              onChange={e => setSearchValues(p => ({ ...p, [opt.name]: e.target.value }))}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 mb-2 outline-none focus:border-[#cc0000] bg-white"
                            />
                          )}
                          <div className="space-y-1 max-h-[160px] overflow-y-auto">
                            {filtered.map(val => {
                              const checked = selected.includes(val)
                              return (
                                <label
                                  key={val}
                                  onClick={() => toggleOption(opt.name, val)}
                                  className="flex items-center gap-2 cursor-pointer group py-0.5"
                                >
                                  <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-[#cc0000] border-[#cc0000]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                    {checked && (
                                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`text-xs transition-colors ${checked ? 'text-[#cc0000] font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                                    {val}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                          {filtered.length === 0 && (
                            <p className="text-[10px] text-gray-400 text-center py-2">검색 결과 없음</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* CAD filter */}
                <div>
                  <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-xs font-medium text-gray-700">CAD</span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </button>
                </div>

                {/* 출하일 filter */}
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">출하일</p>
                  {['전체', '5일 이내'].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer mb-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {v === '전체' && <div className="w-2 h-2 rounded-full bg-[#cc0000]" />}
                      </div>
                      <span className="text-xs text-gray-600">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t border-gray-100">
                <button className="w-full py-2.5 bg-gray-900 hover:bg-[#cc0000] text-white text-xs font-bold rounded-xl transition-colors">
                  외형도 / 후보 보기
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Top card: image + info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <button className="inline-flex items-center gap-1 text-sm font-bold text-gray-700 mb-2 hover:text-[#cc0000] transition-colors">
                    {product.brand} (DSvalv) <ChevronDown size={14} />
                  </button>
                  <h1 className="text-2xl font-black text-gray-900 mb-3">{product.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags.map(tag => (
                      <span key={tag} className={`text-xs font-bold px-3 py-1 rounded-full ${tag === '인기' ? 'bg-red-100 text-red-700' : tag === '특가' ? 'bg-orange-100 text-orange-700' : tag === '당일출하' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {tag === '당일출하' ? '⚡ ' + tag : tag}
                      </span>
                    ))}
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">납기 단축</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">일부 당일 출하 가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} className={i <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                    <span className="text-sm text-gray-400">{product.reviews}건 (리뷰 등록)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setWished(w => !w)}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${wished ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Heart size={16} className={wished ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-all">
                    <Share2 size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className={`${product.color} rounded-2xl aspect-square flex items-center justify-center relative group overflow-hidden`}>
                  <span className="text-[100px] group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <button className="flex-1 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 text-xs font-bold py-2 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5">
                      <Box size={13} /> 3D 미리보기
                    </button>
                    <button className="flex-1 bg-[#cc0000]/90 backdrop-blur-sm hover:bg-[#cc0000] text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5">
                      <Download size={13} /> CAD 데이터
                    </button>
                  </div>
                </div>

                {/* Price + order */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">표준 가격(VAT 별도)</span>
                      <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">수량별 자동가격 할인</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mb-0.5">
                      ₩{product.price.min.toLocaleString()}
                      <span className="text-lg text-gray-500"> ~ ₩{product.price.max.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-4">
                      VAT 포함: ₩{Math.round(product.price.min*1.1).toLocaleString()} ~ ₩{Math.round(product.price.max*1.1).toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                      {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-[10px] text-gray-400 block">{k}</span>
                          <span className="text-xs font-medium text-gray-700">{v}</span>
                        </div>
                      ))}
                    </div>

                    <button className="flex items-center gap-2 text-xs text-[#cc0000] hover:underline mb-4">
                      <FileText size={13} /> 카탈로그 I
                    </button>
                  </div>

                  {/* Selected options pills */}
                  {selectedCount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                      <div className="text-xs font-bold text-blue-700 mb-2">선택된 옵션 ({selectedCount}개)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(selectedOptions).map(([optName, vals]) =>
                          vals.map(v => (
                            <span key={`${optName}-${v}`} className="text-[10px] bg-white border border-blue-200 text-blue-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                              {v}
                              <button onClick={() => toggleOption(optName, v)} className="hover:text-red-500"><X size={9} /></button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500">수량</span>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => setQty(q => Math.max(product.moq, q - 1))}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 text-lg font-light">−</button>
                        <input type="number" value={qty} min={product.moq}
                          onChange={e => setQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                          className="w-14 text-center text-sm font-bold border-x border-gray-200 outline-none py-2" />
                        <button onClick={() => setQty(q => q + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 text-lg font-light">+</button>
                      </div>
                      <span className="text-xs text-gray-400">최소 {product.moq}{product.unit}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddCart}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${addedToCart ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}>
                        <ShoppingCart size={15} />
                        {addedToCart ? '담겼습니다!' : '장바구니'}
                      </button>
                      <button className="flex-1 py-3 bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-xl text-sm font-bold transition-colors">주문</button>
                    </div>
                    <button className="w-full mt-2 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                      <FileText size={13} /> My 부품표 저장
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 형번 확정 바 ── */}
            {isConfirmed && confirmedPartNo && (
              <div className="bg-white border border-green-200 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">형번:</span>
                    <span className="font-black text-base text-gray-900">{confirmedPartNo}</span>
                    <button
                      onClick={clearAll}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-0.5 hover:bg-gray-100 text-gray-500"
                    >해제</button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                      <Box size={13} /> 3D 미리보기
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                      <Download size={13} /> CAD 데이터 다운로드
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── 가격·주문 정보 카드 ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              {/* 주문 시간 안내 */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-4 text-xs text-blue-700">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                이 상품의 18:00 이후 주문건은 익일 접수되오니 유의해 주시기 바랍니다.
              </div>

              {/* 단가·합계·출하일 */}
              <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden mb-3">
                {[
                  { label: '단가(VAT 별도)', value: `${unitPrice.toLocaleString()}원` },
                  { label: '합계(VAT 별도)', value: `${totalPrice.toLocaleString()}원`, sub: `VAT 포함: ${Math.round(totalPrice*1.1).toLocaleString()}원`, bold: true },
                  { label: '참고 출하일', value: new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('ko-KR', {month:'numeric',day:'numeric'}) + ' 이후' },
                ].map(({ label, value, sub, bold }) => (
                  <div key={label} className="bg-white px-4 py-3">
                    <div className="text-[10px] text-gray-400 mb-1">{label}</div>
                    <div className={`text-sm ${bold ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{value}</div>
                    {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>

              {/* 추가 할인 힌트 */}
              {savingsIfNextTier > 0 && nextTierQty && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-xl px-4 py-2.5 mb-4">
                  <Info size={13} className="flex-shrink-0" />
                  <span>
                    <b>{nextTierQty - qty}개</b>만 더 담으면 {nextTierQty}개 구간 단가가 적용됩니다.
                    총 <b className="text-red-600">₩{savingsIfNextTier.toLocaleString()} 절감</b> 가능
                  </span>
                </div>
              )}

              {/* 액션 버튼 행 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50">
                    <FileText size={12} /> My 부품표 저장
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50">
                    <Search size={12} /> 유사품 검색
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50">
                    <GitCompare size={12} /> 비교
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">수량:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => setQty(q => Math.max(product.moq, q-1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600">−</button>
                      <input type="number" value={qty} min={product.moq}
                        onChange={e => setQty(Math.max(product.moq, parseInt(e.target.value)||product.moq))}
                        className="w-12 text-center text-sm font-bold outline-none border-x border-gray-200 py-1" />
                      <button onClick={() => setQty(q => q+1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600">+</button>
                    </div>
                    <span className="text-xs text-gray-400">최대 200개</span>
                  </div>
                  <button onClick={handleAddCart}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${addedToCart ? 'bg-green-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-gray-900'}`}>
                    <ShoppingCart size={14} /> {addedToCart ? '담김!' : '장바구니'}
                  </button>
                  <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-colors">
                    주문
                  </button>
                </div>
              </div>

              {/* 수량별 가격표 */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-2">수량별 단가표</div>
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-gray-500 font-medium text-center">수량</td>
                        {TIERS.map(t => (
                          <td key={t.range}
                            className={`border border-gray-200 px-3 py-2 text-center font-bold ${tierIndex(qty) === TIERS.indexOf(t) ? 'bg-blue-50 text-blue-700 border-blue-300' : 'text-gray-700'}`}>
                            {t.range}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2 text-gray-500 font-medium text-center">표준 가격<br />(VAT 별도)</td>
                        {TIERS.map((t, i) => {
                          const p = Math.round(product.price.min * t.mult)
                          const isActive = tierIndex(qty) === i
                          return (
                            <td key={t.range}
                              className={`border border-gray-200 px-3 py-2 text-center ${isActive ? 'bg-blue-50 font-black text-blue-800 border-blue-300' : 'text-gray-700'}`}>
                              {p.toLocaleString()}원
                              <br />
                              <span className="text-[10px] text-gray-400">({Math.round(p*1.1).toLocaleString()}원)</span>
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── 사양 / 치수 정보 ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <h3 className="text-sm font-black text-gray-800 mb-3">
                {confirmedPartNo ?? product.partNo}의 사양, 치수 정보
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {Object.entries(product.specs).reduce((rows, [k, v], i) => {
                      if (i % 2 === 0) rows.push([])
                      rows[rows.length - 1].push([k, v])
                      return rows
                    }, []).map((pair, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {pair.map(([k, v]) => (
                          <>
                            <td key={`k-${k}`} className="border border-gray-200 px-4 py-2.5 text-gray-500 font-medium bg-gray-50 w-[22%]">{k}</td>
                            <td key={`v-${k}`} className="border border-gray-200 px-4 py-2.5 text-gray-800 font-semibold w-[28%]">{v}</td>
                          </>
                        ))}
                        {pair.length === 1 && (
                          <>
                            <td className="border border-gray-200 px-4 py-2.5 bg-gray-50 w-[22%]" />
                            <td className="border border-gray-200 px-4 py-2.5 w-[28%]" />
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── 탭 섹션 ── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
              {/* Tab bar */}
              <div className="flex border-b border-gray-200">
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === i ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <ChevronDown size={12} />
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* 외형도/규격표 */}
                {activeTab === 0 && (
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-4">외형도/규격표</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <DrawingSVG />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-3">· 재질표</p>
                        <table className="text-xs border-collapse mb-4 w-full max-w-[360px]">
                          <thead>
                            <tr className="bg-gray-100">
                              {['Type', '[M]재질', '[S]표면처리', '[H]경도', '강도구분'].map(h => (
                                <th key={h} className="border border-gray-200 px-3 py-2 font-bold text-gray-700 text-center">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 px-3 py-2 text-center font-bold text-blue-600">{product.partNo.split('-')[0]}</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">S33C</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">사삼산화철 피막</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">22~32HRC</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">8.8 상당</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="text-xs text-gray-500 mb-2">· 규격표</p>
                        <div className="overflow-x-auto">
                          <table className="text-xs border-collapse w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                {['형식', ...Object.keys(product.specs).slice(0, 4)].map(h => (
                                  <th key={h} className="border border-gray-200 px-3 py-2 font-bold text-gray-700 text-center whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {['6', '8', '10', '12'].map((m, i) => (
                                <tr key={m} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border border-gray-200 px-3 py-1.5 text-center font-medium text-blue-600">
                                    {product.partNo.split('-')[0]}{m}-{[10,12,16,20][i]}
                                  </td>
                                  {Object.values(product.specs).slice(0, 4).map((v, j) => (
                                    <td key={j} className="border border-gray-200 px-3 py-1.5 text-center text-gray-700">{v}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 형번 리스트 */}
                {activeTab === 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-black text-gray-900">형번 리스트</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">표시 건수</span>
                        <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                          <option>60건</option>
                          <option>100건</option>
                        </select>
                      </div>
                    </div>
                    <div className="overflow-x-auto -mx-2 px-2">
                      <table className="w-full text-xs border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-gray-100">
                            {['형번', ...product.options.slice(0, 4).map(o => o.name), '최소 주문', '표준 가격(VAT 별도)', '출하일'].map(h => (
                              <th key={h} className="border border-gray-200 px-3 py-2.5 font-bold text-gray-700 text-center whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {partRows.map((row, i) => (
                            <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors cursor-pointer`}>
                              <td className="border border-gray-200 px-3 py-2 text-center font-bold text-blue-600">{row.partNo}</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">{row.v1}</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">{row.v2}</td>
                              {product.options.slice(2, 4).map(opt => (
                                <td key={opt.name} className="border border-gray-200 px-3 py-2 text-center">{opt.values[0]}</td>
                              ))}
                              <td className="border border-gray-200 px-3 py-2 text-center">1개</td>
                              <td className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800">{row.price.toLocaleString()}원</td>
                              <td className="border border-gray-200 px-3 py-2 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.ship === '당일' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {row.ship}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 상세 정보 */}
                {activeTab === 2 && (
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-4">상세 정보</h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                      <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 text-sm font-bold text-gray-700 hover:bg-gray-100">
                        <ChevronDown size={14} /> 기본 정보
                      </button>
                      <div className="px-4 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2">기본 정보</h4>
                        <p className="mb-3">{product.desc}</p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                          <Info size={12} className="inline mr-1" />
                          일부 형번의 사양 및 치수가 게재되지 않은 경우가 있으니, 자세한 내용은 매뉴얼 카탈로그를 참조해 주시기 바랍니다.
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="bg-white flex">
                          <div className="bg-gray-50 text-xs font-medium text-gray-500 px-4 py-3 w-1/2">{k}</div>
                          <div className="text-xs font-semibold text-gray-800 px-4 py-3 w-1/2">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 상품문의 */}
                {activeTab === 3 && (
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-4">상품문의 · 리뷰</h3>

                    {/* 리뷰 작성 */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-200">
                      <div className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <PenLine size={14} /> 리뷰 작성
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(i => (
                          <button
                            key={i}
                            onClick={() => setReviewRating(i)}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star size={20} className={i <= (hoverRating || reviewRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                          </button>
                        ))}
                        <span className="text-xs text-gray-400 ml-2">
                          {reviewRating > 0 ? ['', '별로예요', '그저 그래요', '보통이에요', '좋아요', '최고예요'][reviewRating] : '별점을 선택하세요'}
                        </span>
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        rows={3}
                        placeholder="사용 소감을 남겨주세요..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#cc0000] resize-none mb-3"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={!reviewText.trim() || reviewRating === 0}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                      >
                        <MessageSquare size={14} /> 리뷰 등록
                      </button>
                    </div>

                    {/* 리뷰 목록 */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">아직 등록된 리뷰가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reviews.map(r => (
                          <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} size={12} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-gray-700">{r.author}</span>
                              <span className="text-xs text-gray-400 ml-auto">{r.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── 배송 안내 ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-sm font-black text-gray-900 mb-4">배송 / 재고 안내</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Truck, title: '당일 출하', desc: '오후 5시 이전 주문 시 당일 출하 (일부 품목)', color: 'bg-blue-50 text-blue-600' },
                  { icon: Package, title: '익일 배송', desc: '전국 택배 배송 (도서산간 제외)', color: 'bg-green-50 text-green-600' },
                  { icon: AlertCircle, title: '재고 현황', desc: product.stock >= 9999 ? '충분한 재고 보유 중' : `${product.stock}개 재고`, color: 'bg-amber-50 text-amber-600' },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 mb-0.5">{title}</div>
                      <div className="text-[11px] text-gray-500 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 모바일 사이드바 (드로어용 내용) ── */
function MobileSidebar({ product, selectedOptions, toggleOption, clearAll, confirmedCount, totalOptions, isConfirmed, expandedOption, setExpandedOption, searchValues, setSearchValues }) {
  return (
    <div className="pt-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isConfirmed
            ? <><CheckCircle2 size={14} className="text-green-600" /><span className="text-sm font-bold text-green-700">확정 되었습니다</span></>
            : <span className="text-sm font-bold text-gray-700">{confirmedCount}/{totalOptions} 선택됨</span>
          }
        </div>
        <button onClick={clearAll} className="text-xs text-[#cc0000] hover:underline font-medium">모두 해제</button>
      </div>
      <div className="space-y-2">
        {product.options.map((opt) => {
          const selected = selectedOptions[opt.name] || []
          const isOpen = expandedOption === opt.name
          const search = searchValues[opt.name] || ''
          const filtered = opt.values.filter(v => v.toLowerCase().includes(search.toLowerCase()))
          return (
            <div key={opt.name} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedOption(isOpen ? null : opt.name)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{opt.name}</span>
                  {selected.length > 0 && (
                    <span className="text-[10px] bg-[#cc0000] text-white rounded-full px-1.5 py-0.5 font-bold">{selected.length}</span>
                  )}
                </div>
                {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
              </button>
              {isOpen && (
                <div className="p-3">
                  {opt.values.length > 6 && (
                    <input
                      type="text"
                      placeholder="검색"
                      value={search}
                      onChange={e => setSearchValues(p => ({ ...p, [opt.name]: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 outline-none"
                    />
                  )}
                  <div className="flex flex-wrap gap-2">
                    {filtered.map(val => {
                      const checked = selected.includes(val)
                      return (
                        <button
                          key={val}
                          onClick={() => toggleOption(opt.name, val)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${checked ? 'bg-[#cc0000] border-[#cc0000] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`}
                        >
                          {val}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
