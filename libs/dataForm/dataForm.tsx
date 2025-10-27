"use client";
import { useBearerStore } from "@/app/api/api";
import axios from "axios";
import { useEffect, useState } from "react";
import circleclose from "@/public/circle-close-multiple-svgrepo-com.svg";
import Image from "next/image";

interface OverlayFormProps {
  closeForm: () => void;
}

interface OverlayFormData {
  userId?: number;
  amountType: string;
  categoryType: string;
  actualAmount: string | number;
}

const OverlayForm: React.FC<OverlayFormProps> = ({ closeForm }) => {
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedData = sessionStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const userId = parsedData?.data?.id;
      if (userId) {
        setId(userId);
        setFormData((prev) => ({ ...prev, userId }));
      }
    }
  }, []);

  const [formData, setFormData] = useState<OverlayFormData>({
    userId: id,
    amountType: "",
    categoryType: "",
    actualAmount: "",
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
      [name]: name === "actualAmount" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      console.error("User ID not found!");
      return;
    }

    try {
      const saveData = await axios.post(
        `https://budgeting-be.onrender.com/api/transactions`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useBearerStore.getState().token}`,
          },
        }
      );

      setFormData({
        ...formData,
        amountType: "",
        categoryType: "",
        actualAmount: "",
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
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="" disabled>
              Select Amount Type
            </option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <label className="text-gray-700 font-semibold">Category Type</label>
          <select
            name="categoryType"
            value={formData.categoryType}
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
            type="number"
            name="actualAmount"
            placeholder="Actual Amount"
            value={formData.actualAmount}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg h-12 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <button
            type="submit"
            className=" bg-blue-500 from-green-500 to-green-600 text-white font-semibold h-12 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverlayForm;
