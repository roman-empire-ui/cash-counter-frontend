
const localhost = 4001

export const signup = async(userData) =>{

    try{
        const res = await fetch(`http://localhost:${localhost}/api/v1/admin/signin`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body : JSON.stringify(userData)
           
        })
        const data = await res.json()
        console.log('Sign in success' , data)
        return data
    } catch (e) {
        console.log('error', e)
    }
}

export const login = async(userData) => {
    try{
        const res = await fetch(`http://localhost:${localhost}/api/v1/admin/login`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(userData)
        })

        const data = await res.json() 
        console.log('Logged in' , data)
        return data

    } catch(e) {
        console.log('error occured' , e)
    }
}

