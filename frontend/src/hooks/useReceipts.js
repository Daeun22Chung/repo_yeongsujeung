import { useCallback, useEffect, useRef, useState } from 'react'
import { receiptsApi } from '../api/receipts'

const INIT_FILTERS = { date_from: '', date_to: '', category: '', store_name: '' }

/**
 * 지출 목록 조회 커스텀 훅
 * - 필터·페이지 상태 관리
 * - 자동 fetch (필터·페이지 변경 시)
 */
export function useReceipts(perPage = 20) {
  const [filters, setFilters] = useState(INIT_FILTERS)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], total: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const fetch = useCallback(() => {
    // 이전 요청 취소
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    const params = { ...filters, page, per_page: perPage }
    Object.keys(params).forEach((k) => !params[k] && delete params[k])

    receiptsApi
      .getList(params)
      .then((res) => {
        if (controller.signal.aborted) return
        const d = res.data?.data ?? res.data
        setData({
          items: d.items ?? [],
          total: d.total ?? 0,
          total_pages: d.total_pages ?? 1,
        })
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err.message ?? '목록을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
  }, [filters, page, perPage])

  useEffect(() => {
    fetch()
    return () => abortRef.current?.abort()
  }, [fetch])

  function changeFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function resetFilters() {
    setFilters(INIT_FILTERS)
    setPage(1)
  }

  return { data, loading, error, filters, page, setPage, changeFilter, resetFilters, refetch: fetch }
}

/**
 * 단건 영수증 조회·수정·삭제 커스텀 훅
 */
export function useReceipt(id) {
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    receiptsApi
      .getById(id)
      .then((res) => setReceipt(res.data?.data ?? res.data))
      .catch((err) => setError(err.message ?? '영수증을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  async function update(payload) {
    setSaving(true)
    try {
      const res = await receiptsApi.update(id, payload)
      setReceipt(res.data?.data ?? res.data)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    setSaving(true)
    try {
      await receiptsApi.remove(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    } finally {
      setSaving(false)
    }
  }

  return { receipt, loading, saving, error, update, remove }
}
