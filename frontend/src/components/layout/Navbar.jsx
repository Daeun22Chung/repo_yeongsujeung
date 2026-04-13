import { Menu, Receipt } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        aria-label="메뉴 열기"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
        <Receipt size={20} />
        AI 영수증 지출 관리
      </div>
    </header>
  )
}
