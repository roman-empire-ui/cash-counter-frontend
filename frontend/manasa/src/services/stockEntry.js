const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"


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

export const calRem = async ({ date, amountHave, stockEntryId , extraSources }) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/remAmount`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ date, amountHave, stockEntryId , extraSources})
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

export const getRemAmts = async () => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/get-rem-amounts`, {
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

export const getStockWithDate = async(date) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/stock/stock-by-date?date=${date}`,{
            method : 'GET',
            headers : authHeaders()
        })
        const data = await res.json()
        console.log(data)
        return data
        
    } catch (error) {
        console.log('error' , error) 
        return {success : false , message : 'Error occured while fetching the data'}
    }
}



// export const updateRemAmount = async (stockEntryId, amountHave) => {
//     try {
//       const res = await fetch(`${apiUrl}/api/v1/stock/updateAmountHave/${stockEntryId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amountHave }),
//       });
  
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       console.error("Error updating remaining amount:", err);
//       return { success: false, message: "Network error" };
//     }
//   };


