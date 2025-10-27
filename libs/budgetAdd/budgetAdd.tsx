"use client";
import { addBudgetData, useBearerStore } from "@/app/api/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";

interface BudgetAddProps {
  closeForm: () => void;
  userId: number;
  tokenData: string;
}

interface BudgetAddData {
  userId?: number;
  name: string;
  budget: string;
  amountType: "" | "Credit" | "Debit";
}

const BudgetAdd: React.FC<BudgetAddProps> = ({
  closeForm,
  userId,
  tokenData,
}) => {
  const [id, setId] = useState<number>(userId);
  const [token, setToken] = useState<string>(tokenData);
  const [formData, setFormData] = useState<BudgetAddData>({
    userId: id,
    name: "",
    budget: "",
    amountType: "",
  });

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
      [name]: name === "budget" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !token) {
      console.error("Missing user ID or token!");
      return;
    }

    try {
      const saveData = await addBudgetData(
        { token, id: formData.userId },
        formData
      );
      console.log("Saved:", saveData.data);

      setFormData({
        userId: formData.userId,
        name: "",
        budget: "",
        amountType: "",
      });

      closeForm();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={closeForm}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold transition cursor-pointer"
        >
          <Image src={circleclose} alt="Close" width={24} height={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Entry
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
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            type="text"
            name="budget"
            placeholder="Enter The Budget"
            value={formData.budget}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold h-12 rounded-lg hover:bg-blue-600 transition-all shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetAdd;
