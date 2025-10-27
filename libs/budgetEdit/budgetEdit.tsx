import {
  editBudgetData,
  editFormDataById,
  getDataBudgetbyid,
  useBearerStore,
} from "@/app/api/api";
import React, { use, useEffect, useState } from "react";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import Image from "next/image";

interface EditBudgetProps {
  closeForm: () => void;
  id?: number | null;
  token?: string | null;
  initialData?: {
    userId?: number;
    name: string;
    budget: number;
    amountType: "" | "Credit" | "Debit";
  };
}

const EditBudgetData: React.FC<EditBudgetProps> = ({
  closeForm,
  id,
  token,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    userId: id,
    name: initialData?.name || "",
    budget: initialData?.budget || 0,
    amountType: initialData?.amountType || "",
  });

  const fetchdata = async (id: number) => {
    try {
      const response = await getDataBudgetbyid({
        token: useBearerStore.getState().token,
        id,
      });
      if (response.status === 200 && response.data) {
        setFormData({
          userId: response.data.userId,
          name: response.data.name,
          budget: response.data.budget,
          amountType: response.data.amountType,
        });
      }
    } catch (error) {
      console.error("Error fetching data by ID:", error);
    }
  };

  useEffect(() => {
    fetchdata(id!);
  }, []);

  const creditCategories = ["Salary", "Bonus", "Investment", "Others"];
  const debitCategories = [
    "Food",
    "Entertainment",
    "Utilities",
    "Travel",
    "Others",
  ];

  const categories =
    formData.amountType === "Credit"
      ? creditCategories
      : formData.amountType === "Debit"
      ? debitCategories
      : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "actualAmount" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = await editBudgetData({ token, id: id }, formData);

    console.log("Updated data:", formData);
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative cursor-pointer">
        <button
          onClick={closeForm}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          <Image src={circleclose} alt="Close" width={24} height={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Edit Data
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-700 font-semibold">Amount Type</label>
          <select
            name="amountType"
            value={formData.amountType}
            onChange={handleChange}
            className="px-2 py-1 border rounded"
          >
            <option value="">All Amount Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
          <label className="text-gray-700 font-semibold">Category Type</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label className="text-gray-700 font-semibold">Actual Amount</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold h-12 rounded-lg hover:bg-blue-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetData;
