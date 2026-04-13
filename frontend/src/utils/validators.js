const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '지원하지 않는 파일 형식입니다. JPG, PNG, PDF 파일만 업로드 가능합니다.'
  }
  if (file.size > MAX_SIZE) {
    return '파일 크기가 10MB를 초과합니다.'
  }
  return null
}
