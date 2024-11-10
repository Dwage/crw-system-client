export const api = {
  fetchData: async (table, params) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sortColumn: params.sortColumn || '',
      sortDirection: params.sortDirection || '',
      ...params.filters,
    }).toString()
    console.log(queryParams)
    const response = await fetch(
      `https://localhost:7000/api/${table}?${queryParams}`
    )
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  },
  createItem: async (table, item) => {
    console.log(JSON.stringify(item))
    const response = await fetch(`https://localhost:7000/api/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  },
  updateItem: async (table, id, item) => {
    const response = await fetch(`https://localhost:7000/api/${table}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  },
  deleteItem: async (table, id) => {
    const response = await fetch(`https://localhost:7000/api/${table}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Network response was not ok')
  },
}
