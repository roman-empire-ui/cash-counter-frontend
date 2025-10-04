const apiUrl = import.meta.env.VITE_API_BASE_URL || ""

const userFromStorage = localStorage.getItem('user');
const genToken = () => {
  const user = JSON.parse(userFromStorage);
  console.log("Parsed user object:", user);
  return user?.token;
}

console.log("Generated token:", genToken());

  console.log(genToken())
  const authHeaders = () => ({

    headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${genToken()}`
    },


  })


export const createDistributor = async (name) => {
    try {
        const res = await fetch(`${apiUrl}/api/v1/dist/createDist`, {
            method: 'POST',
             ...authHeaders(),
            body: JSON.stringify({name})
        })

        return await res.json()
    } catch (e) {
        console.log(e)
        return { success: false, message: e }
    }
}

export const searchDistributor = async (query) => {
    try {

        const res = await fetch(`${apiUrl}/api/v1/dist/searchDist?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            ...authHeaders()

        })
        return await res.json()


    } catch (e) {
        console.log(e)
        return { success: false, data: [], message: e.message }
    }
}