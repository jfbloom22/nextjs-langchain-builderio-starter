const createURL = (path: string) => {
    return window.location.origin + path
}

export const creatNewInventory = async () => {
    const res = await fetch(new Request(createURL('/api/inventory'), {method: 'POST'}))

    if (res.ok) {
        const data = await res.json()
        return data.data
    }
    throw new Error('Failed to create inventory')
}

export const createStore = async (name: string) => {
    const res = await fetch(new Request(createURL('/api/store'), {method: 'POST', body: JSON.stringify({name})}))

    if (res.ok) {
        const data = await res.json()
        return data.data
    }
    throw new Error('Failed to create store')
}

export const updateStore = async (id: string, name: string) => {
    const res = await fetch(new Request(createURL(`/api/store/${id}`), {method: 'PATCH', body: JSON.stringify({name})}))

    if (res.ok) {
        const data = await res.json()
        return data.data
    }
    throw new Error('Failed to update store')
}

