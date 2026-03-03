const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"


const authHeaders = () => ({
headers: {
        'Content-Type': 'application/json',
        
    },
  })







// ✅ Mark Attendance
export const markAttendance = async (data) => {
  const res = await fetch(`${apiUrl}/api/v1/attendance/mark`, {
    method: "POST",
    ...authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// ✅ Get Monthly Summary
export const getMonthlySummary = async (employeeId, month, year) => {
  const res = await fetch(
    `${apiUrl}/api/v1/attendance/getMonSummary?employeeId=${employeeId}&month=${month}&year=${year}`
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// ✅ Get Monthly Records
export const getMonthlyRecords = async (employeeId, year, month) => {
  const res = await fetch(`${apiUrl}/api/v1/attendance/${employeeId}/${year}/${month}`);

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// ✅ Update Attendance
export const updateAttendance = async (data) => {
  const res = await fetch(`${apiUrl}/api/v1/attendance/update`, {
    method: "PUT",
    ...authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};