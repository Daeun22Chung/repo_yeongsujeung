import { getCategoryBadgeClass } from '../../utils/categoryColors'

export default function Badge({ category }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryBadgeClass(category)}`}>
      {category || '미분류'}
    </span>
  )
}
