import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaUserShield, FaHistory, FaGlobe, FaDesktop, FaSignInAlt, FaSignOutAlt, FaSearch, FaFilter } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import socket from "../socket";
import Admin_Nav from "./Admin_Nav";

const Admin_History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchHistory();
    
    // WebSocket listeners
    socket.on("adminHistoryUpdate", handleAdminUpdate);
    socket.on("adminLogout", handleAdminLogout);

    return () => {
      socket.off("adminHistoryUpdate", handleAdminUpdate);
      socket.off("adminLogout", handleAdminLogout);
    };
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/admins/admin-history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });
  };

  const handleAdminUpdate = ({ action, data }) => {
    if (action === "login") {
      setHistory((prev) => [data, ...prev]);
    }
  };

  const handleAdminLogout = ({ adminName, logoutTime }) => {
    setHistory((prev) =>
      prev.map((record) =>
        record.adminName === adminName && !record.logoutTime
          ? { ...record, logoutTime }
          : record
      )
    );
  };

  const filteredHistory = history.filter((record) => {
    const matchesSearch = record.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.ipAddress.includes(searchTerm) ||
                         record.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.operatingSystem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === "all" || 
                         (filters.status === "active" ? !record.logoutTime : 
                          (filters.status === "success" ? record.status === "Success" :
                           record.status !== "Success"));

    return matchesSearch && matchesStatus;
  });

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const getStatusBadge = (status, logoutTime) => {
    if (status !== "Success") return "Failed";
    if (!logoutTime) return "Active";
    return "Success";
  };

  const getStatusColor = (status) => {
    if (status !== "Success") return "bg-red-500";
    return "bg-green-500";
  };

  const getStatusText = (status, logoutTime) => {
    if (status !== "Success") return "Failed";
    if (!logoutTime) return "Active";
    return "Success";
  };

  return (
    <>
      <Admin_Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent mt-16">
                <Typewriter 
                  words={[
                    "Admin Activity Log",
                    "Login History",
                    "Access Records",
                    "Security Audit"
                  ]} 
                  loop 
                  cursor 
                  cursorStyle="|" 
                  typeSpeed={70}
                  deleteSpeed={50}
                />
              </h1>
              <p className="text-gray-400 mt-2">Monitor all administrator access and activity</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchHistory}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all"
            >
              <IoMdRefresh className={`${loading ? "animate-spin" : ""}`} />
              Refresh
            </motion.button>
          </div>

          {/* Filters and Search */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by admin, IP, browser..."
                  className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Sessions</option>
                    <option value="success">Successful Logins</option>
                    <option value="failed">Failed Attempts</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* History Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "linear" 
                  },
                  scale: {
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse"
                  }
                }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-700 shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Admin
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Access Info
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record, index) => (
                        <React.Fragment key={index}>
                          <motion.tr 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`hover:bg-gray-800/50 cursor-pointer ${expandedRow === index ? 'bg-gray-800/30' : ''}`}
                            onClick={() => toggleRowExpand(index)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                  <FaUserShield className={`text-lg ${
                                    record.status !== "Success" ? "text-red-400" : 
                                    record.logoutTime ? "text-green-400" : "text-blue-400"
                                  }`} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">{record.adminName}</div>
                                  <div className="text-sm text-gray-400">Attempts: {record.totalAttempts}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300 flex items-center gap-2">
                                <FaGlobe className="text-blue-300" />
                                {record.ipAddress}
                              </div>
                              <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                <FaDesktop className="text-purple-300" />
                                {record.browser} / {record.operatingSystem}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                record.status !== "Success" ? "bg-red-500" : 
                                !record.logoutTime ? "bg-blue-500" : "bg-green-500"
                              } text-white`}>
                                {getStatusText(record.status, record.logoutTime)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                  <FaSignInAlt className={`${
                                    record.status !== "Success" ? "text-red-300" : "text-green-300"
                                  } text-xs`} />
                                  <span>{new Date(record.timestamp).toLocaleString()}</span>
                                </div>
                                {record.logoutTime && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FaSignOutAlt className="text-red-300 text-xs" />
                                    <span>{new Date(record.logoutTime).toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-400 hover:text-blue-300">
                                Details
                              </button>
                            </td>
                          </motion.tr>
                          
                          {/* Expanded Row */}
                          <AnimatePresence>
                            {expandedRow === index && (
                              <motion.tr 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-800/20"
                              >
                                <td colSpan="5" className="px-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <h4 className="font-medium text-gray-300 mb-2">Session Details</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">User Agent:</span>
                                          <span className="text-gray-300">{record.userAgent}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Location:</span>
                                          <span className="text-gray-300">Coming soon</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-300 mb-2">Security Info</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Status:</span>
                                          <span className={`font-semibold ${
                                            record.status !== "Success" ? "text-red-400" : 
                                            !record.logoutTime ? "text-blue-400" : "text-green-400"
                                          }`}>
                                            {getStatusText(record.status, record.logoutTime)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Session Duration:</span>
                                          <span className="text-gray-300">
                                            {record.logoutTime 
                                              ? `${Math.round((new Date(record.logoutTime) - new Date(record.timestamp)) / 60000)} minutes` 
                                              : 'Ongoing'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <FaHistory className="text-4xl mb-3 opacity-50" />
                            <p className="text-lg">No matching records found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Admin_History;