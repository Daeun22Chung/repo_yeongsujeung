import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * React Error Boundary
 * - 렌더링 중 발생한 JS 에러를 잡아 전체 화면이 흰 빈 화면이 되는 것을 방지
 * - 에러 화면 + 새로고침 버튼 제공
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-rose-50 p-4">
              <AlertTriangle size={32} className="text-rose-500" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">문제가 발생했습니다</h2>
          <p className="text-sm text-gray-500 mb-1">예기치 않은 오류가 발생했습니다.</p>
          {this.state.error?.message && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-3 text-left break-all">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={() => this.handleReset()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={15} />
            처음으로 돌아가기
          </button>
        </div>
      </div>
    )
  }
}
