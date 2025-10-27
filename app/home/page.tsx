"use client";
import plus from "@/public/icons8-plus.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { deleteDataById, fetchDashboardData } from "../api/api";
import { useBearerStore } from "../api/api";
import OverlayForm from "@/libs/dataForm/dataForm";
import EditDataForm from "@/libs/editForm/editForm";
import deleteImage from "@/public/delete-svgrepo-com.svg";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import pencil from "../../public/icons8-pencil-30.png";
import RouteGuard from "@/libs/guard/guard";

interface DashboardData {
  id: number;
  amountType: string;
  categoryType: string;
  actualAmount: number;
  balance: number;
  createdAt: string;
}

interface StoreDate {
  startDate: string;
  endDate: string;
  month: string;
}

const Dashboard = () => {
  const [openSpinner, setOpenSpinner] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [data, setData] = useState<DashboardData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number>(0);
  const [store, setStore] = useState<StoreDate[]>([
    {
      startDate: "",
      endDate: "",
      month: "",
    },
  ]);
  const [filters, setFilters] = useState({
    amountType: "",
    categoryType: "",
    fromDate: "",
    toDate: "",
  });
  const itemsPerPage = 10;

  function formatLocalDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function getMonthsWithDates(year: number): StoreDate[] {
    const months: StoreDate[] = [];

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0);
      const monthName = start.toLocaleString("default", { month: "long" });

      months.push({
        month: monthName,
        startDate: formatLocalDate(start),
        endDate: formatLocalDate(end),
      });
    }

    return months;
  }

  let payload: { token: string | null; id: number | undefined };
  let id: number | undefined;

  useEffect(() => {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    const months = getMonthsWithDates(currentYear);
    setYear(currentYear);
    setMonth(currentMonthIndex);
    setStore(months);

    setFilters((prev: any) => ({
      ...prev,
      fromDate: months[currentMonthIndex].startDate,
      toDate: months[currentMonthIndex].endDate,
    }));

    const storedData = sessionStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const id = parsedData?.data?.id;
      const bearer = useBearerStore.getState().token;

      if (id && bearer) {
        setUserId(id);
        setToken(bearer);
      }
    }
  }, [year, month]);

  useEffect(() => {
    if (userId && token) fetchData(currentPage);
  }, [userId, token, open, open1, currentPage]);

  const fetchData = async (page = 1) => {
    try {
      if (!token || !userId) return;
      const payload = { token, id: userId };
      console.log(token);

      const response = await fetchDashboardData(
        payload,
        filters,
        page,
        itemsPerPage
      );
      if (response.status === 200) {
        setOpenSpinner(false);
      }

      setData(response.data);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fnopenForm = () => {
    setOpen(true);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchData(prevPage);
    }
  };

  const handleDelete = async (id: number) => {
    const payload = { token, id };
    try {
      const deleteResponse = await deleteDataById(payload);
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleFilterChange = () => {
    fetchData(currentPage);
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
        <div className="min-h-screen h-auto p-2">
          <div className="flex flex-col sm:flex-row justify-between mb-4 items-start sm:items-center gap-2 align-middle">
            <div className="font-bold text-2xl">Budget Summary</div>
            <div>
              <div className="flex gap-4 align-middle">
                <div className="relative inline-block text-left ">
                  <button
                    onClick={() => setOpenDropdown(!open)}
                    className="inline-flex justify-center w-full px-4 py-2  bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Filters
                  </button>

                  {openDropdown && (
                    <div className="absolute mt-3 w-[300] mx-2 bg-white rounded-b-md shadow-lg z-50 p-4 flex flex-col gap-2 right-5">
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
                <div>
                  <button
                    className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-semibold hover:bg-green-500 hover:ring-2 hover:ring-green-500 cursor-pointer"
                    onClick={fnopenForm}
                  >
                    <Image src={plus} alt="Add" width={30} height={30} />
                    Add New Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {open && <OverlayForm closeForm={() => setOpen(false)} />}
          {open1 && (
            <EditDataForm
              closeForm={() => setOpen1(false)}
              id={editId}
              token={token}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Category Type
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
                    Reason for Amount
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Actual Amount
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">
                    Balance
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700 hidden lg:table-cell">
                    Created At
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {(data || []).map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4 px-6 text-sm text-gray-800">
                      {item.amountType}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 hidden sm:table-cell">
                      {item.categoryType}
                    </td>
                    <td
                      className={`py-4 px-6 text-sm ${
                        item.amountType === "Credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.actualAmount}/-
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 hidden md:table-cell">
                      {item.balance}/-
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 hidden lg:table-cell">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <button
                          className="hover:text-blue-600"
                          onClick={() => {
                            setOpen1(true);
                            setEditId(item.id);
                          }}
                        >
                          <Image
                            src={pencil}
                            alt="Edit"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                          />
                        </button>
                        <button
                          className="hover:text-blue-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Image
                            src={deleteImage}
                            alt="Delete"
                            width={20}
                            height={20}
                            className="ml-4 cursor-pointer"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default Dashboard;
