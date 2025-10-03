
const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"

export const signup = async(userData) =>{

    try{
        const res = await fetch(`${apiUrl}/api/v1/admin/signin`,{
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
        const res = await fetch(`${apiUrl}/api/v1/admin/login`,{
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
        return {success : false , message :e.message || 'Something went wrong'}
    }
}


export const resetPasswordRequest = async({email}) => {
    if(!email) return {success : false , message : 'Email is required'}
    try {
        const res = await fetch(`${apiUrl}/api/v1/admin/resetPasswordRequest`, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },

            body : JSON.stringify({email})
        })

        const data = await res.json()
        if(!res.ok) {
            
            throw new Error(data.message || 'Password reset failed')
        }

       console.log(data)
        return data
    } catch(e) {
        console.log('error' , e)
        return {success : false , message : 'Server Error'}
    }
} 

export const resetPassword = async ({ token, newPassword, confirmPassword }) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/resetPassword`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed');
      }
  
      return data;
    } catch (e) {
      console.error('error', e);
      return { success: false, message: e.message || 'Something went wrong' }; // return a standard object
    }
  };
  

