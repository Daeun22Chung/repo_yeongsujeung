import client from './client'

export const categoriesApi = {
  getAll() {
    return client.get('/categories')
  },
}
