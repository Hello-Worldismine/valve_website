import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

const links = {
  '고객 서비스': ['주문 조회', '배송 안내', '반품·교환', '세금계산서', 'FAQ'],
  '회사 안내': ['회사 소개', '채용 정보', '파트너십', '뉴스룸'],
  '기술 지원': ['CAD 다운로드', '기술 자료', '표준 규격', '단위 변환기'],
  '쇼핑 안내': ['회원가입', '마이페이지', '장바구니', '견적 요청'],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Top */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="bg-[#cc0000] text-white font-black text-xl px-3 py-1.5 rounded inline-block mb-3">
              DSvalv
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              산업용 기계 부품 전문 쇼핑몰.<br />
              8억 개 이상의 부품을 빠르고 편리하게.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={12} /> 1588-0001
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={12} /> cs@dsvalv.com
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} /> 서울특별시 강남구
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-600">
            © 2025 DSvalv Co., Ltd. All rights reserved.
          </div>
          <div className="flex gap-4">
            {['이용약관', '개인정보처리방침', '사업자정보확인'].map(t => (
              <a key={t} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-0.5">
                {t} {t === '사업자정보확인' && <ExternalLink size={10} />}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-3 text-center text-[10px] text-gray-700">
          본 사이트는 데모 목적으로 제작된 클론 페이지입니다.
        </div>
      </div>
    </footer>
  )
}
