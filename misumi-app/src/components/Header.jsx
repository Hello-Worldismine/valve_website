import { useState } from 'react'
import {
  Search, ShoppingCart, User, ChevronDown, Menu, X,
  Phone, Globe, Bell, Heart, Package
} from 'lucide-react'

const navCategories = [
  { name: '기계 부품', sub: ['베어링', '체인', '벨트', '기어', '커플링'] },
  { name: '전기·전자', sub: ['스위치', '센서', '케이블', '커넥터', 'LED'] },
  { name: '공구', sub: ['절삭 공구', '연삭 공구', '측정 공구', '수공구'] },
  { name: '소재', sub: ['금속 소재', '수지 소재', '고무', '스폰지'] },
  { name: 'FA·자동화', sub: ['에어실린더', '솔레노이드밸브', '리니어가이드'] },
  { name: '배관', sub: ['파이프', '피팅', '밸브', '호스'] },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeNav, setActiveNav] = useState(null)
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" onMouseLeave={() => setActiveNav(null)}>
      {/* Top bar — 모바일에선 숨김 */}
      <div className="hidden sm:block bg-[#cc0000] text-white text-xs py-1.5">
        <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              고객센터: 1588-0001 (평일 9~18시)
            </span>
            <span className="hidden md:block text-white/60">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Package size={11} />
              당일 출하 / 익일 배송 가능
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline flex items-center gap-1">
              <Globe size={11} /> 사이트 안내
            </a>
            <span className="text-white/60">|</span>
            <a href="#" className="hover:underline">회원가입</a>
            <span className="text-white/60">|</span>
            <a href="#" className="hover:underline">로그인</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4">
        {/* 모바일 햄버거 */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <a href="#" className="flex-shrink-0 flex items-center gap-2">
          <div className="bg-[#cc0000] text-white font-black text-lg sm:text-xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-tight">
            DSvalv
          </div>
          <span className="text-xs text-gray-400 hidden lg:block leading-tight">
            산업용 부품 전문<br />쇼핑몰
          </span>
        </a>

        {/* Search bar */}
        <div className={`flex-1 relative min-w-0 transition-all ${searchFocused ? 'shadow-lg' : ''}`}>
          <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-colors ${searchFocused ? 'border-[#cc0000]' : 'border-gray-300'}`}>
            {/* 데스크탑에서만 카테고리 셀렉트 표시 */}
            <select className="hidden sm:block border-none bg-gray-50 text-sm text-gray-600 px-3 py-2 border-r border-gray-300 outline-none cursor-pointer flex-shrink-0">
              <option>전체</option>
              <option>부품번호</option>
              <option>상품명</option>
              <option>CAD번호</option>
            </select>
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="부품번호, 상품명, 규격으로 검색"
              className="flex-1 px-3 py-2 sm:py-2.5 text-sm outline-none bg-white min-w-0"
            />
            <button className="bg-[#cc0000] hover:bg-[#aa0000] transition-colors text-white px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1 sm:gap-1.5 text-sm font-medium flex-shrink-0">
              <Search size={16} />
              <span className="hidden sm:inline">검색</span>
            </button>
          </div>
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 p-3">
              <p className="text-xs text-gray-400 mb-2">최근 검색어</p>
              {['SUS304', 'LM가이드', '에어실린더', '볼베어링'].map(t => (
                <button key={t} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded text-gray-700">
                  <Search size={12} className="inline mr-2 text-gray-400" />{t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions — 모바일: 장바구니만, 데스크탑: 전부 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <a href="#" className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group">
            <User size={20} className="group-hover:text-[#cc0000] transition-colors" />
            <span className="text-[10px]">마이페이지</span>
          </a>
          <a href="#" className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group">
            <Heart size={20} className="group-hover:text-[#cc0000] transition-colors" />
            <span className="text-[10px]">찜목록</span>
          </a>
          <a href="#" className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group relative">
            <Bell size={20} className="group-hover:text-[#cc0000] transition-colors" />
            <span className="absolute top-0.5 right-1.5 bg-[#cc0000] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
            <span className="text-[10px]">알림</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group relative">
            <ShoppingCart size={20} className="group-hover:text-[#cc0000] transition-colors" />
            <span className="absolute top-0.5 right-1.5 bg-[#cc0000] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">2</span>
            <span className="text-[10px]">장바구니</span>
          </a>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="border-t border-gray-100 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-4">
          <ul className="flex">
            {navCategories.map((cat) => (
              <li
                key={cat.name}
                className="relative group"
                onMouseEnter={() => setActiveNav(cat.name)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <button className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeNav === cat.name ? 'text-[#cc0000] border-[#cc0000]' : 'text-gray-700 border-transparent hover:text-[#cc0000]'}`}>
                  {cat.name}
                  <ChevronDown size={13} className={`transition-transform ${activeNav === cat.name ? 'rotate-180' : ''}`} />
                </button>
                {activeNav === cat.name && (
                  <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-lg z-40 py-2 min-w-[160px]">
                    {cat.sub.map(s => (
                      <a key={s} href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#cc0000] whitespace-nowrap">
                        {s}
                      </a>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <a href="#" className="block px-4 py-1.5 text-xs text-[#cc0000] hover:underline">전체 보기 →</a>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <li className="ml-auto">
              <a href="#" className="flex items-center gap-1 px-4 py-3 text-sm font-bold text-[#cc0000] hover:bg-red-50 transition-colors">
                🔥 특가 상품
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#cc0000] transition-colors">
                CAD 다운로드
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#cc0000] transition-colors">
                기술 자료
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg max-h-[70vh] overflow-y-auto">
          {/* 모바일 상단 바 링크 */}
          <div className="flex gap-4 px-4 py-3 bg-[#cc0000]/10 border-b border-gray-100">
            <a href="#" className="text-xs text-gray-600 hover:text-[#cc0000]">로그인</a>
            <a href="#" className="text-xs text-gray-600 hover:text-[#cc0000]">회원가입</a>
            <a href="#" className="text-xs text-gray-600 hover:text-[#cc0000]">마이페이지</a>
            <a href="#" className="text-xs text-gray-600 hover:text-[#cc0000]">찜목록</a>
          </div>
          {/* 추가 메뉴 */}
          <div className="flex gap-4 px-4 py-2.5 border-b border-gray-100">
            <a href="#" className="text-xs font-bold text-[#cc0000]">🔥 특가 상품</a>
            <a href="#" className="text-xs text-gray-600">CAD 다운로드</a>
            <a href="#" className="text-xs text-gray-600">기술 자료</a>
          </div>
          {navCategories.map(cat => (
            <details key={cat.name} className="border-b border-gray-100">
              <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer list-none flex items-center justify-between">
                {cat.name} <ChevronDown size={14} className="text-gray-400" />
              </summary>
              <div className="bg-gray-50 px-6 pb-2">
                {cat.sub.map(s => (
                  <a key={s} href="#" className="block py-2 text-sm text-gray-600 hover:text-[#cc0000]">{s}</a>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </header>
  )
}
