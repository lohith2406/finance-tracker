import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
});

// ----- Axios interceptor to attach JWT token -----
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Transactions -----
export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data: any) => API.post("/transactions", data);
export const deleteTransaction = (id: string) => API.delete(`/transactions/${id}`);

// ----- Budgets -----
export const getBudgets = () => API.get("/budgets");
export const addBudget = (data: any) => API.post("/budgets", data);
export const deleteBudget = (id: string) => API.delete(`/budgets/${id}`);

// ----- Auth -----
export const signupUser = (data: any) => API.post("/auth/signup", data);
export const loginUser = (data: any) => API.post("/auth/login", data);
