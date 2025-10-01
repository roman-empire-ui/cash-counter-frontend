const apiUrl = import.meta.env.VITE_API_BASE_URL || ""


const genToken = () => {
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) return null;
    try {
        const user = JSON.parse(userFromStorage);
        return user?.token;
    } catch (err) {
        console.error("Error parsing user token:", err)
        return null;
    }
}

console.log("Token being sent:", genToken());

const authHeaders = () => {
    const token = genToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};


export const stockEntry = async ({ date, distributors }) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/stockEntry`, {
            method: 'POST',
            headers: authHeaders(),
            credentials : "include",
            body: JSON.stringify({ date, distributors })
        })

        const data = await res.json()
        console.log('data', data)
        return data

    } catch (e) {
        console.log('Error Occured', e)
    }
}


export const getStocks = async () => {
    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/allStocks`, {
            method: 'GET',
            headers: authHeaders(),
            credentials : 'include'

        })

        const data = await res.json()
        console.log(data)
        return data
    } catch (e) {
        console.log('error Occured', e)
    }
}

export const updateStock = async ({ stockId, distributorId, name, totalPaid }) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/updateStock/${stockId}/${distributorId}`, {
            method: 'PUT',
            headers: authHeaders(),

            body: JSON.stringify({ name, totalPaid })
        })

        const data = await res.json()
        console.log('data', data)
        return data
    } catch (e) {
        console.log('error', e)
        return { success: false, message: 'Error Occured while editing' }

    }
}


export const deleteStock = async ({ stockId, distributorId }) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/deleteDist/${stockId}/${distributorId}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        const data = await res.json()
        return data
    } catch (e) {
        console.log('error', e)
        return { success: false, message: 'Error Occured while deleting' }
    }
}

export const calRem = async ({ date, amountHave, stockEntryId }) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/remAmount`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ date, amountHave, stockEntryId })
        })
        const data = await res.json()
        return data

    } catch (e) {
        console.log('error', e)
        return { success: false, message: "Error Occured while calculating" };
    }
}


export const getRemAmt = async (stockEntryId) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/getRemAmount/${stockEntryId}`, {
            method: 'GET',
            headers: authHeaders()
        })
        const data = await res.json()
        return data
    } catch (e) {
        console.log('error', e)
        return { success: false, message: "Error Occured while getting the amount" };
    }
}


