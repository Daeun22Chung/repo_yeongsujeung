import client from './client'

export const receiptsApi = {
  upload(file, onUploadProgress) {
    const form = new FormData()
    form.append('file', file)
    return client.post('/receipts/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
      onUploadProgress,
    })
  },

  getList(params) {
    return client.get('/receipts', { params })
  },

  getById(id) {
    return client.get(`/receipts/${id}`)
  },

  update(id, data) {
    return client.put(`/receipts/${id}`, data)
  },

  remove(id) {
    return client.delete(`/receipts/${id}`)
  },
}
