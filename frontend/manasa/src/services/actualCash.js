// src/services/actualCash.js
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

export const saveRemCash = async (payload) => {
  try {
    const res = await fetch(`${apiUrl}/api/v1/counter/remCash`, {
      method: "POST",
       ...authHeaders(),
      
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    // return backend response (backend returns { success: true/false, message, remainingCash })
    return data;
  } catch (e) {
    console.error("saveRemCash error:", e);
    return { success: false, message: e.message || "Network error" };
  }
};

export const getRemCash = async (date = null) => {
  try {
    let url = `${apiUrl}/api/v1/counter/getRemainingCash`;
    if (date) url += `?date=${encodeURIComponent(date)}`;

    const res = await fetch(url);
    const data = await res.json();
    return data; // could be array (all entries) or { message, data } for a date
  } catch (e) {
    console.error("getRemCash error:", e);
    return { success: false, message: e.message || "Network error" };
  }
};
