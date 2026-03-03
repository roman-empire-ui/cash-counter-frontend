import { useState, useEffect } from "react";
import {
  markAttendance,
  getMonthlySummary,
  getMonthlyRecords,
  updateAttendance,
} from "../services/attendance.js";
import { getAllEmployees } from "../services/employeeService.js";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    status: "",
  });

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await getAllEmployees();
    setEmployees(data.data);
  };

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If employee changes → clear summary + records
    if (name === "employeeId") {
      setSummary(null);
      setRecords([]);
    }

    setFormData({ ...formData, [name]: value });
  };

  /* ================= AUTO FETCH WHEN EMPLOYEE + DATE CHANGES ================= */
  useEffect(() => {
    if (formData.employeeId && formData.date) {
      fetchMonthData();
    }
  }, [formData.employeeId, formData.date]);

  /* ================= MARK ATTENDANCE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await markAttendance(formData);
      alert("⚡ Attendance Marked Successfully");
      fetchMonthData(); // refresh after marking
    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= FETCH MONTH DATA ================= */
  const fetchMonthData = async () => {
    try {
      const selected = new Date(formData.date);
      const month = selected.getMonth() + 1;
      const year = selected.getFullYear();

      const summaryData = await getMonthlySummary(
        formData.employeeId,
        month,
        year
      );

      const recordData = await getMonthlyRecords(
        formData.employeeId,
        year,
        month
      );

      setSummary(summaryData.data);
      setRecords(recordData.data);
    } catch (err) {
      setError("Failed to fetch monthly data", err);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async (date, newStatus) => {
    try {
      await updateAttendance({
        employeeId: formData.employeeId,
        date,
        newStatus,
      });

      fetchMonthData(); // refresh after update
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-purple-200 p-6">
      <div className="max-w-5xl mx-auto bg-black/60 p-8 rounded-2xl border border-purple-500/30 shadow-[0_0_40px_#a855f7]">

        <h1 className="text-3xl text-purple-400 text-center mb-6 font-bold">
          ⚡ Cyber Attendance Panel
        </h1>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">

          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="p-3 bg-black border border-purple-500 rounded-xl focus:outline-none focus:shadow-[0_0_10px_#a855f7]"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-3 bg-black border border-purple-500 rounded-xl focus:outline-none focus:shadow-[0_0_10px_#a855f7]"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="p-3 bg-black border border-purple-500 rounded-xl focus:outline-none focus:shadow-[0_0_10px_#a855f7]"
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="WeekOff">WeekOff</option>
            <option value="Absent">Absent</option>
            <option value="LossOfPay">LossOfPay</option>
          </select>

          <button className="bg-purple-600 hover:bg-purple-700 rounded-xl shadow-[0_0_15px_#a855f7] transition-all">
            Mark
          </button>
        </form>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mt-4 bg-red-900/40 p-3 border border-red-500 rounded">
            {error}
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        {summary && (
          <div className="mt-8 grid grid-cols-4 gap-4 text-center text-lg">
            <div className="p-4 bg-purple-900/30 rounded-xl shadow-[0_0_15px_#9333ea]">
              Present: {summary.presentDays}
            </div>
            <div className="p-4 bg-purple-900/30 rounded-xl shadow-[0_0_15px_#9333ea]">
              WeekOff: {summary.weekOffDays}
            </div>
            <div className="p-4 bg-purple-900/30 rounded-xl shadow-[0_0_15px_#9333ea]">
              Absent: {summary.absentDays}
            </div>
            <div className="p-4 bg-purple-900/30 rounded-xl shadow-[0_0_15px_#9333ea]">
              LOP: {summary.lossOfPayDays}
            </div>
          </div>
        )}

        {/* ================= RECORD TABLE ================= */}
        {records.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left border border-purple-500/30">
              <thead>
                <tr className="bg-purple-900/40">
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id} className="border-t border-purple-500/20 hover:bg-purple-900/20">
                    <td className="p-3">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{rec.status}</td>
                    <td className="p-3">
                      <select
                        defaultValue={rec.status}
                        onChange={(e) =>
                          handleStatusUpdate(rec.date, e.target.value)
                        }
                        className="bg-black border border-purple-500 rounded px-2 py-1"
                      >
                        <option value="Present">Present</option>
                        <option value="WeekOff">WeekOff</option>
                        <option value="Absent">Absent</option>
                        <option value="LossOfPay">LossOfPay</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AttendancePage;