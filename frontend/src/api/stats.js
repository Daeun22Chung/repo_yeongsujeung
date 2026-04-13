import client from './client'

export const statsApi = {
  getSummary(params) {
    return client.get('/stats/summary', { params })
  },
}
