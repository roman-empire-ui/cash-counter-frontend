const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"


// const userFromStorage = localStorage.getItem('user');
// const genToken = () => {
//   const user = JSON.parse(userFromStorage);
//   console.log("Parsed user object:", user);
//   return user?.token;
// }

// console.log("Generated token:", genToken());

//   console.log(genToken())
  const authHeaders = () => ({

    headers: {
        'Content-Type': 'application/json',
        
    },


  })



export const cashCount = async (date ,notes , coins) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/counter/initialCount`, {
            method : "POST",
            ...authHeaders(),
            body : JSON.stringify({date ,notes , coins})
        })

        const data = await res.json() 
        console.log(data) 
        return data
    } catch (e) {
        console.log('error' , e)
        return{success : false , message : e}
    }
}



export const getInitialCount = async (date) => {
    try {

        const url = date? `${apiUrl}/api/v1/counter/getInitial?date=${date}` :
        `${apiUrl}/api/v1/counter/getInitial`
    
        const res = await fetch(url , {method : 'GET' , ...authHeaders()})

        const data = await res.json()
        console.log(data)
        return data
    } catch (e) {
        console.log('error' , e)
        return { success: false, message: e };
    }
}


export const getDataByRange = async(from , to) => {

    try {
        const res = await fetch(`${apiUrl}/api/v1/counter/dataByRange?from=${from}&to=${to}`,{
            method : "GET",
            ...authHeaders()
        })

        const data = await res.json()
        return data
    } catch (e) {
        console.log('error' , e)
        return {success : false , message : e}
    }
}