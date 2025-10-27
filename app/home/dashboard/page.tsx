"use client";
import {
  fetchDashboardData,
  getDataBudget,
  useBearerStore,
} from "@/app/api/api";
import DashboardChart, {
  ExpectedDashboardChart,
} from "../../../libs/dashboardChart/dashboardchart";
import { useEffect, useState } from "react";
import PieChart, {
  BudgetPieChart,
} from "../../../libs/dashboardChart/pieChart";
import PieChartSummary from "@/libs/dashboardChart/pieChartSummary";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import Image from "next/image";
import RouteGuard from "@/libs/guard/guard";

const Dashboard = () => {
  const [openSpinner, setOpenSpinner] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [filters, setFilters] = useState({
    amountType: "",
    categoryType: "",
    fromDate: "",
    toDate: "",
  });

  const [select, SetSelect] = useState("");

  const graphs = ["All", "Bar Chart", "Pie Chart", "Total Summary"];

  const handleGraph = (graph: string) => {
    SetSelect(graph);
    sessionStorage.setItem("graph", graph);
    setOpen(false);
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("data");
    if (!storedData) return;

    const parsedData = JSON.parse(storedData);
    const id = parsedData?.data?.id;
    const bearer = useBearerStore.getState().token;

    const storedGraph = sessionStorage.getItem("graph");
    if (storedGraph) {
      SetSelect(storedGraph);
    } else {
      sessionStorage.setItem("graph", "All");
    }

    if (id && bearer) {
      setUserId(id);
      setToken(bearer);
    }
  }, []);

  useEffect(() => {
    if (userId && token) getDashboardData();
  }, [userId, token]);

  const getDashboardData = async () => {
    try {
      const result = await fetchDashboardData({ id: userId, token }, filters);

      if (result.status === 200) {
        setData(result.data);
      } else {
        console.error("Error fetching dashboard data:", result.message);
      }
      const result1 = await getDataBudget({ id: userId, token }, filters);
      console.log(result1.data);

      if (result1.status === 200) {
        setData1(result1.data);
      } else {
        console.error("Error fetching dashboard data:", result.message);
      }

      if (result.status === 200 && result1.status === 200) {
        setOpenSpinner(false);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = () => {
    getDashboardData();
    setOpenDropdown(false);
  };

  return (
    <RouteGuard>
      {openSpinner ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div>
            <div className="flex justify-between align-middle">
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Transaction Dashboard
                </h2>
              </div>

              <div className="flex gap-2">
                <div>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setOpen(true)}
                      className="px-4 py-2 w-48 bg-white border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50"
                    >
                      <span>{select}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {open && (
                      <ul className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {graphs.map((option) => (
                          <li
                            key={option}
                            onClick={() => handleGraph(option)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="relative inline-block text-left ">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="inline-flex justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Filters
                  </button>

                  {openDropdown && (
                    <div className="absolute mt-3 w-[300] bg-white rounded-b-md shadow-lg z-50 p-4 flex flex-col gap-2 right-10">
                      <div className="mb-4">
                        <button
                          onClick={() => setOpenDropdown(false)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl  font-bold transition cursor-pointer"
                        >
                          <Image
                            src={circleclose}
                            alt="Close"
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>
                      <label className="text-gray-700 font-semibold">
                        Amount Type
                      </label>
                      <select
                        name="amountType"
                        value={filters.amountType}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="">All Amount Types</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                      <label className="text-gray-700 font-semibold">
                        Category Type
                      </label>
                      <input
                        type="text"
                        name="categoryType"
                        placeholder="Category"
                        value={filters.categoryType}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded"
                      />

                      <div className="">
                        <label className="text-gray-700 font-semibold">
                          From Date
                        </label>
                        <div>
                          <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleChange}
                            className="px-2 py-1 border rounded w-full"
                          />
                        </div>
                        <label className="text-gray-700 font-semibold">
                          To Date
                        </label>
                        <div>
                          <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleChange}
                            className="px-2 py-1 border rounded w-full"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setFilters({
                            amountType: "",
                            categoryType: "",
                            fromDate: "",
                            toDate: "",
                          })
                        }
                        className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Clear Filters
                      </button>

                      <button
                        onClick={() => {
                          handleFilterChange();
                        }}
                        className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            {(select === "Total Summary" || select === "All") && (
              <div className="flex flex-row md:flex-row items-center justify-around gap-6 bg-white p-2 rounded-xl shadow-md">
                <div className="text-xl font-semibold text-gray-800">
                  Total Summary
                </div>

                <div className="  items-center justify-center">
                  <PieChartSummary data={data} />
                </div>
              </div>
            )}
          </div>
          {(select === "Bar Chart" || select === "All") && (
            <div className="flex flex-row md:flex-row items-center justify-around gap-6 bg-white p-2 rounded-xl shadow-md my-2">
              <div className="flex flex-col align-middle justify-center mb-4">
                <div>
                  <ExpectedDashboardChart data={data1} />
                </div>
                <div className="text-center font-semibold">Expected Budget</div>
              </div>
              <div className="flex  flex-col align-middle justify-center mb-4">
                <div>
                  <DashboardChart data={data} />
                </div>
                <div className="text-center font-semibold">Actual Budget</div>
              </div>
            </div>
          )}

          {(select === "Pie Chart" || select === "All") && (
            <div className="flex flex-row md:flex-row items-center justify-around gap-6 bg-white p-2 rounded-xl shadow-md my-2">
              <div className="flex flex-col align-middle justify-center mb-4">
                <div>
                  <BudgetPieChart data={data1} />
                </div>
                <div className="text-center font-semibold">Expected Budget</div>
              </div>
              <div className="flex  flex-col align-middle justify-center mb-4">
                <div>
                  <PieChart data={data} />
                </div>
                <div className="text-center font-semibold">Actual Budget</div>
              </div>
            </div>
          )}
        </div>
      )}
    </RouteGuard>
  );
};

export default Dashboard;
