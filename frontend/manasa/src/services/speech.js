// src/services/handoverApi.js

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

// Get user token from localStorage
const userFromStorage = localStorage.getItem("user");
const genToken = () => {
  const user = JSON.parse(userFromStorage);
  return user?.token;
};

// Headers with Authorization
const authHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${genToken()}`,
  },
});

// Parse speech text into structured data


// Send parsed data to backend
export const createHand = async (handoverData) => {
 try {
  const res = await fetch(`${apiUrl}/api/v1/speech/createHandover`, {
    method: "POST",
    ...authHeaders(),
    body: JSON.stringify(handoverData),
  });
  const data = res.json()
  return data;
 } catch (e) {
  console.log('error' , e)
  return {sucess : false}
 }
};


export const getHandovers = async () => {
  try{
    
      const res = await fetch(`${apiUrl}/api/v1/speech/getHandover`, {
        method: "GET",
        ...authHeaders(),
      });
      return res.json();
    
  } catch(e){
    console.log('error' , e)
    return {success : false}
  }
};



export const deleteHand = async(id) => {
  try {
    const res = await fetch(`${apiUrl}/api/v1/speech/deleteHand/${id}`,{
      method : "DELETE",
      ...authHeaders()
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.log('error' , e)
    return {success : false}
  }
}