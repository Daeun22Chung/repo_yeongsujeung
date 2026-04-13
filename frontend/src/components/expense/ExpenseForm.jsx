import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import ItemRow from './ItemRow'
import { getAllCategories } from '../../utils/categoryColors'
import { formatCurrency } from '../../utils/formatters'

const CATEGORY_OPTIONS = [
  { value: '', label: '카테고리 선택' },
  ...getAllCategories().map((c) => ({ value: c, label: c })),
]

export default function ExpenseForm({ receipt, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (receipt) {
      setForm({
        store_name: receipt.store_name || '',
        date: receipt.date || '',
        category: receipt.category || '',
        items: receipt.items?.map((it) => ({ ...it })) || [],
      })
    }
  }, [receipt])

  if (!form) return null

  const total = form.items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
    0
  )

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function updateItem(index, key, val) {
    const items = form.items.map((it, i) => (i === index ? { ...it, [key]: val } : it))
    setForm((prev) => ({ ...prev, items }))
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: '', quantity: 1, unit_price: 0, total_price: 0 }],
    }))
  }

  function deleteItem(index) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  function handleSave() {
    const payload = {
      ...form,
      items: form.items.map((it) => ({
        ...it,
        total_price: (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
      })),
      total_amount: total,
    }
    onSave(payload)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="상호명"
          value={form.store_name}
          onChange={(e) => setField('store_name', e.target.value)}
        />
        <Input
          label="날짜"
          type="date"
          value={form.date}
          onChange={(e) => setField('date', e.target.value)}
        />
        <Select
          label="카테고리"
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(e) => setField('category', e.target.value)}
          className="sm:col-span-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">품목</p>
          <button onClick={addItem} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
            <Plus size={13} /> 항목 추가
          </button>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">품명</th>
                <th className="px-3 py-2 text-center">수량</th>
                <th className="px-3 py-2 text-right">단가</th>
                <th className="px-3 py-2 text-right">소계</th>
                <th className="px-3 py-2 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 px-3">
              {form.items.map((item, i) => (
                <tr key={i} className="px-3">
                  <td colSpan={5} className="px-3">
                    <table className="w-full">
                      <tbody>
                        <ItemRow
                          item={item}
                          index={i}
                          onChange={updateItem}
                          onDelete={deleteItem}
                        />
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
        <span className="text-sm font-medium text-indigo-700">합계</span>
        <span className="text-lg font-bold text-indigo-700">{formatCurrency(total)}</span>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>취소</Button>
        <Button onClick={handleSave} isLoading={isSaving}>저장</Button>
      </div>
    </div>
  )
}
