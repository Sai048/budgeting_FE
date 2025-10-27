"use client";
import plus from "@/public/icons8-plus.svg";
import Image from "next/image";
import deleteImage from "@/public/delete-svgrepo-com.svg";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import pencil from "@/public/icons8-pencil-30.png";
import { useEffect, useState } from "react";
import {
  deleteBudgetDataById,
  getDataBudget,
  useBearerStore,
} from "@/app/api/api";
import BudgetAdd from "@/libs/budgetAdd/budgetAdd";
import EditBudgetData from "@/libs/budgetEdit/budgetEdit";
import RouteGuard from "@/libs/guard/guard";

interface BudgetExpectationData {
  id: number;
  name: string;
  userId: number;
  budget: number;
  createdAt: string;
  amountType: "" | "Credit" | "Debit";
}

const BudgetExpectation = () => {
  const [openSpinner, setOpenSpinner] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [data, setData] = useState<BudgetExpectationData[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("data");
    if (!storedData) return;

    const parsedData = JSON.parse(storedData);
    const id = parsedData?.data?.id;
    const bearer = useBearerStore.getState().token;

    if (id && bearer) {
      setUserId(id);
      setToken(bearer);
    }
  }, []);

  useEffect(() => {
    if (token) fetchData();
  }, [token, open, open1]);

  const fetchData = async (page = 1) => {
    try {
      if (!token) return;
      const payload = { token, id: userId };

      const response = await getDataBudget(payload);

      if (response.status === 200 ) {
        setOpenSpinner(false);
      }

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const payload = { token, id };
    try {
      const deleteResponse = await deleteBudgetDataById(payload);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
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
            <div className="font-bold text-2xl">Set Your Budget</div>

            <div>
              <button
                className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-semibold hover:bg-green-500 hover:ring-2 hover:ring-green-500 cursor-pointer"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Image src={plus} alt="Add" width={30} height={30} />
                Add New Budget
              </button>
            </div>
          </div>

          {open && (
            <BudgetAdd
              closeForm={() => setOpen(false)}
              userId={userId}
              tokenData={token}
            />
          )}

          {open1 && (
            <EditBudgetData
              closeForm={() => setOpen1(false)}
              id={editId}
              token={token}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  {/* <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Category Type
              </th> */}
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                    Actual Amount
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
                    {/* <td className="py-4 px-6 text-sm text-gray-800">{item.amountType}</td> */}
                    <td className="py-4 px-6 text-sm text-gray-800">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 hidden sm:table-cell">
                      {item.budget}
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
        </div>
      )}
    </RouteGuard>
  );
};

export default BudgetExpectation;
