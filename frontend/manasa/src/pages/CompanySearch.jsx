import React, { useEffect, useState } from "react";
import { getDataByRange } from "../services/cashCounter";

export default function CompanyListFuturistic() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const flattenCompanies = (entries = []) => {
        return entries.flatMap((entry) =>
            (entry.companies || []).map((c, idx) => ({
                _id: c._id || `${entry._id}-${idx}`,
                name: c.name || "-",
                paidAmount: c.paidAmount || 0,
                date: entry.date,
            }))
        );
    };

    const handleSearch = async () => {
        if (!from || !to) return alert("Please select both From and To dates");

        try {
            setLoading(true);
            const res = await getDataByRange(from, to);
            const arr = res?.data || res || [];
            const flat = flattenCompanies(arr);
            setCompanies(flat);
            applyFilter(flat, search);
            setCurrentPage(1);
        } catch (e) {
            console.error(e);
            alert("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const normalize = (s = "") =>
        s.toString().toLowerCase().trim().replace(/\s+/g, " ");

    const applyFilter = (list, q) => {
        const cleanedQ = normalize(q);
        if (!cleanedQ) return setFiltered(list);

        const words = cleanedQ.split(" ").filter(Boolean);

        const out = list.filter((c) => {
            const name = normalize(c.name);
            return words.every((w) => name.includes(w));
        });

        setFiltered(out);
    };

    useEffect(() => {
        applyFilter(companies, search);
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const currentData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const highlight = (name, q) => {
        if (!q) return name;
        const nq = normalize(q);
        if (!nq) return name;

        const words = nq
            .split(" ")
            .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .filter(Boolean);

        if (!words.length) return name;

        const regex = new RegExp(`(${words.join("|")})`, "ig");
        const parts = name.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="px-1 rounded neon-highlight">
                    {part}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    return (
        <div className="min-h-screen p-6 bg-[#02030a] text-white relative overflow-hidden">

            {/* ==== TITLE & DATE FILTERS ==== */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">

                    <h1 className="text-4xl font-extrabold tracking-widest text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                         REPORTS
                    </h1>

                    <div className="flex gap-4 items-center">

                        {/* ---- FROM DATE ---- */}
                        <div className="flex items-center gap-2 bg-[#0a0f1a] border border-neon/40 px-3 py-2 rounded-xl shadow-[0_0_10px_rgba(126,231,255,0.15)]">
                            <label className="text-sm text-gray-300 mr-2">From</label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="bg-white text-black px-2 py-1 rounded-md outline-none text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-[#0a0f1a] border border-neon/40 px-3 py-2 rounded-xl shadow-[0_0_10px_rgba(233,30,255,0.15)]">
                            <label className="text-sm text-gray-300 mr-2">To</label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="bg-white text-black px-2 py-1 rounded-md outline-none text-sm"
                            />
                        </div>

                        {/* ---- SEARCH BUTTON ---- */}
                        <button
                            onClick={handleSearch}
                            className="futuristic-btn bg-gradient-to-r from-[#00eaff] via-[#7c3aed] to-[#ff007f]"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="flex items-center justify-between mt-6">
                    <div className="relative w-full max-w-lg flex items-center gap-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search companies..."
                            className="w-full futuristic-input px-4 py-3"
                        />

                        {/* Total results next to search input */}
                        <div className="text-sm text-gray-400 ml-2">
                            Total: <span className="text-cyan-300 font-semibold">{filtered.length}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setSearch("");               // clear search input
                            applyFilter(companies, "");  // reset filtered list
                            setCurrentPage(1);           // go back to first page
                        }}
                        className="ml-4 futuristic-btn bg-gradient-to-r from-[#ff0066] via-[#ff8a00] to-[#ffee00]"
                    >
                        Clear
                    </button>

                </div>
            </div>

            {/* ==== TABLE WRAPPER ==== */}
            <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-cyan-300/20 shadow-[0_0_25px_rgba(0,255,255,0.15)]">

                <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-[#05101f] border-b border-cyan-300/20">
                        <tr>
                            <th className="th">S.NO</th>
                            <th className="th">Date</th>
                            <th className="th">Company</th>
                            <th className="th">Paid Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-cyan-300">
                                    Loading futuristic data...
                                </td>
                            </tr>
                        ) : currentData.length ? (
                            currentData.map((c, idx) => (
                                <tr
                                    key={c._id}
                                    className="border-t border-cyan-300/10 hover:bg-[#05172a]"
                                >
                                    <td className="td">
                                        {(currentPage - 1) * itemsPerPage + idx + 1}
                                    </td>
                                    <td className="td">
                                        {new Date(c.date).toLocaleDateString()}
                                    </td>
                                    <td className="td text-white">
                                        {highlight(c.name, search)}
                                    </td>
                                    <td className="td text-cyan-200">{c.paidAmount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-400">
                                    No matching companies found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ==== PAGINATION ==== */}
            {/* ==== PAGINATION ==== */}
            <div className="max-w-6xl mx-auto mt-6 text-gray-300">

                {/* Result text */}
                <div className="text-center mb-3">
                    Showing{" "}
                    <span className="text-cyan-300">
                        {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}
                    </span>{" "}
                    -{" "}
                    <span className="text-cyan-300">
                        {Math.min(filtered.length, currentPage * itemsPerPage)}
                    </span>{" "}
                    of{" "}
                    <span className="text-cyan-300">{filtered.length}</span>
                </div>

                {/* Centered pagination buttons */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Prev
                    </button>

                    <div className="px-4 py-2 rounded bg-[#03101b] text-cyan-300">
                        {currentPage} / {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* ==== CUSTOM FUTURISTIC STYLES ==== */}
            <style>{`
                .th { padding: 14px; color: #9beeff; font-weight:500; text-align:left; }
                .td { padding: 14px; color: #d4eaff; }

                .futuristic-input {
                    background: rgba(0, 20, 40, 0.4);
                    border: 1px solid rgba(0, 255, 255, 0.25);
                    border-radius: 14px;
                    padding: 12px 14px;
                    color: #fff;
                    outline: none;
                }

                .futuristic-btn {
                    padding: 12px 22px;
                    border-radius: 14px;
                    font-weight: 600;
                    color: white;
                    font-size: 15px;
                    background-size: 300% 300%;
                    animation: holoGrad 6s ease infinite;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.25);
                    transition: 0.2s;
                }

                .futuristic-btn:hover {
                    transform: scale(1.07);
                    box-shadow: 0 0 25px rgba(0, 255, 255, 0.45);
                }

                @keyframes holoGrad {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .pagination-btn {
                    padding: 8px 16px;
                    background: rgba(0, 20, 40, 0.5);
                    border: 1px solid rgba(0, 255, 255, 0.25);
                    color: #7eeeff;
                    border-radius: 10px;
                }

                .pagination-btn:disabled {
                    opacity: 0.3;
                }

                .neon-highlight {
                    background: linear-gradient(90deg, #00eaff33, #ff00ff33);
                    border-radius: 6px;
                    padding: 2px 4px;
                }
            `}</style>
        </div>
    );
}
