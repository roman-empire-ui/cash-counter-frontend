const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"


const authHeaders = () => ({

    headers: {
        'Content-Type': 'application/json',
        
    },


  })
/**
 * Get today's loss session
 */
export const getTodayLossSession = async (date) => {
  const res = await fetch(
    `${apiUrl}/api/v1/ai/session?date=${date}`
  );
  return res.json();
};

/**
 * Get next AI question
 */
export const getNextQuestion = async (sessionId) => {
  const res = await fetch(
    `${apiUrl}/api/v1/ai/question/${sessionId}`
  );
  return res.json();
};

/**
 * Answer AI question
 */
export const answerQuestion = async (sessionId, payload) => {
  const res = await fetch(
    `${apiUrl}/api/v1/ai/answer/${sessionId}`,
    {
      method: "POST",
      ...authHeaders(),
      body: JSON.stringify(payload),
    }
  );

  return res.json();
};
