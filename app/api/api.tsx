import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface BearerStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

interface LoginPageProps {
  email: string;
  password: string;
}

const url="https://budgeting-be.onrender.com/api";

// const url = "http://localhost:9000/api";
export const useBearerStore = create<BearerStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "bearer",
    }
  )
);

export const handleLogin = async (payload: LoginPageProps) => {
  try {
    const response = await axios.post(`${url}/users/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return { status: 500, message: "Something went wrong" };
    }
  }
};

export const fetchDashboardData = async (
  payload: any,
  filters?: any,
  page?: number,
  limit?: number
) => {
  try {
    const queryParams = new URLSearchParams();

    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

    if (filters?.amountType)
      queryParams.append("amountType", filters.amountType);
    if (filters?.categoryType)
      queryParams.append("categoryType", filters.categoryType);
    if (filters?.fromDate) queryParams.append("fromDate", filters.fromDate);
    if (filters?.toDate) queryParams.append("toDate", filters.toDate);

    const queryString = queryParams.toString();
    const response = await axios.get(
      `${url}/transactions/user/${payload.id}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const fetchDataById = async (payload: any, id: number) => {
  try {
    const response = await axios.get(`${url}/transactions/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const deleteDataById = async (payload: any) => {
  try {
    const response = await axios.delete(`${url}/transactions/${payload.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const editFormDataById = async (payload: any, formData: any) => {
  try {
    const response = await axios.put(
      `${url}/transactions/${payload.id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const getDataBudget = async (payload: any, filters?: any) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.amountType)
      queryParams.append("amountType", filters.amountType);
    if (filters?.categoryType) queryParams.append("name", filters.categoryType);
    if (filters?.fromDate) queryParams.append("fromDate", filters.fromDate);
    if (filters?.toDate) queryParams.append("toDate", filters.toDate);

    const queryString = queryParams.toString();
    const response = await axios.get(
      `${url}/budget-expectation/user/${payload.id}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const getDataBudgetbyid = async (payload: any) => {
  try {
    const response = await axios.get(
      `${url}/budget-expectation/${payload.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const deleteBudgetDataById = async (payload: any) => {
  try {
    const response = await axios.delete(
      `${url}/budget-expectation/${payload.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const addBudgetData = async (payload: any, formData: any) => {
  try {
    const response = await axios.post(`${url}/budget-expectation`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};

export const editBudgetData = async (payload: any, formData: any) => {
  try {
    const response = await axios.put(
      `${url}/budget-expectation/${payload.id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
      };
    }
  }
};
