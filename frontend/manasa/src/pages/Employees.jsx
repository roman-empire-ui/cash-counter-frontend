import { useEffect, useState } from "react";
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getAllEmployees,
} from "../services/employeeService";
import { useNavigate } from "react-router-dom";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    role: "",
    monthlySalary: "",
    allowedWeekOffs: "",
  });

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔥 Updated handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If Manager selected → auto weekOff = 0
    if (name === "role" && value === "Manager") {
      setFormData({
        ...formData,
        role: value,
        allowedWeekOffs: 0,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      mobile: employee.mobile,
      role: employee.role,
      monthlySalary: employee.monthlySalary,
      allowedWeekOffs: employee.allowedWeekOffs,
    });
    setEditId(employee._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await deactivateEmployee(id);
      fetchEmployees();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editId) {
        await updateEmployee(editId, {
          ...formData,
          monthlySalary: Number(formData.monthlySalary),
          allowedWeekOffs: Number(formData.allowedWeekOffs),
        });
        setMessage("⚡ Employee Updated Successfully");
        setEditId(null);
      } else {
        await createEmployee({
          ...formData,
          monthlySalary: Number(formData.monthlySalary),
          allowedWeekOffs: Number(formData.allowedWeekOffs),
        });
        setMessage("⚡ Employee Created Successfully");
      }

      setFormData({
        name: "",
        mobile: "",
        role: "",
        monthlySalary: "",
        allowedWeekOffs: "",
      });

      fetchEmployees();
    } catch (error) {
      setMessage("❌ " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">

      {/* Neon Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600 opacity-20 blur-[150px] bottom-[-100px] right-[-100px]"></div>

      <div className="relative max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-purple-400 mb-2 tracking-wider">
          Employee Management
        </h1>
        <p className="text-purple-300 mb-10">
          Management Interface
        </p>
        

          <button
            onClick={() => navigate("/attendance")}
            className="absolute top-6 right-6 
               px-6 py-2 
               bg-purple-600 
               hover:bg-purple-700 
               text-white font-semibold 
               rounded-xl 
               border border-purple-400/40
               shadow-[0_0_20px_#a855f7] 
               hover:shadow-[0_0_30px_#d946ef] 
               transition-all duration-300 
               tracking-wider"
          >
           Attendance
          </button>

          {/* Your existing content here */}

       

        {/* FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-[0_0_30px_#7e22ce] mb-10">

          <h2 className="text-2xl text-purple-400 mb-6">
            {editId ? "Edit Employee" : "Create Employee"}
          </h2>

          {message && (
            <div className="mb-6 p-3 bg-purple-900/40 border border-purple-500 rounded-lg text-purple-300 shadow-[0_0_10px_#a855f7]">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            {/* Name */}
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 bg-black/40 border border-purple-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_#a855f7] transition-all placeholder-purple-400 text-purple-200"
            />

            {/* Mobile */}
            <input
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="p-3 bg-black/40 border border-purple-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_#a855f7] transition-all placeholder-purple-400 text-purple-200"
            />

            {/* 🔥 Role Select */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="p-3 bg-black/40 border border-purple-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_#a855f7] text-purple-200"
            >
              <option value="" disabled className="bg-black">
                -- Select Role --
              </option>
              <option value="Manager" className="bg-black">
                Manager
              </option>
              <option value="SalesStaff" className="bg-black">
                Sales Staff
              </option>
              <option value="Cashier" className="bg-black">
                Cashier
              </option>
            </select>


            {/* Week Offs */}
            <input
              type="number"
              name="allowedWeekOffs"
              placeholder="Allowed Week Offs"
              value={formData.allowedWeekOffs}
              onChange={handleChange}
              required
              disabled={formData.role === "Manager"}
              className={`p-3 bg-black/40 border border-purple-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_#a855f7] transition-all placeholder-purple-400 text-purple-200 ${formData.role === "Manager" ? "opacity-50 cursor-not-allowed" : ""
                }`}
            />

            <button
              type="submit"
              className="md:col-span-2 mt-4 py-3 bg-purple-600 hover:bg-purple-700 transition-all rounded-xl shadow-[0_0_20px_#a855f7] hover:shadow-[0_0_35px_#c084fc] font-bold tracking-wider"
            >
              {loading
                ? "Processing..."
                : editId
                  ? "Update Employee"
                  : "Create Employee"}
            </button>

          </form>
        </div>

        {/* TABLE (unchanged) */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-[0_0_30px_#7e22ce]">
          <h2 className="text-2xl text-purple-400 mb-6">
            Active Employees
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-purple-200">
              <thead>
                <tr className="border-b border-purple-500/30 text-purple-400">
                  <th className="p-3 text-center">Name</th>
                  <th className="p-3 text-center">Mobile</th>
                  <th className="p-3 text-center">Role</th>
                  <th className="p-3 text-cenetr">Week Offs Allowed</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b border-purple-500/10 hover:bg-purple-900/20 transition"
                  >
                    <td className="p-3 text-center">{emp.name}</td>
                    <td className="p-3 text-center">{emp.mobile}</td>
                    <td className="p-3 text-center text-purple-400">{emp.role}</td>
                    <td className="p-3 text-center">{emp.allowedWeekOffs}</td>
                    <td className="p-3 flex justify-center gap-3 text-center">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="px-4 py-1 bg-purple-500 hover:bg-purple-600 rounded-lg shadow-[0_0_15px_#a855f7]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="px-4 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg shadow-[0_0_15px_#d946ef]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {employees.length === 0 && (
              <div className="text-center text-purple-500 py-6">
                No employees found in system
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;