import "../../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import IncomesTable from "../../dataTable/IncomesTable";
import AddIncomeForm from "./addIncomeForm";


const API_GET_MONTHLY_SUBSCRIPTION_INCOME = "/admin/monthlySubscriptionIncome/";
const API_GET_MONTHLY_EXPENSES =  "/admin/monthlyExpenses/";
const API_GET_TOTAL_MONTHLY_INCOMES =  "/admin/totalMonthlyIncomes/";
const API_GET_TOTAL_MONTHLY_BALANCE =  "/admin/monthlyBalance/";

const MonthlyBalancePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const controller = new AbortController();



  const [monthlySubscriptionIncome, setMonthlySubscriptionIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [totalMonthlyIncomes, setTotalMonthlyIncomes] = useState(0);
  const [monthlyBalance, setTotalMonthlyBalance] = useState(0);

  const notifyError = (text) => {
    toast.error(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  const notifySuccess = (text) => {
    toast.success(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  useEffect(() => {
    let isMounted = true;
    getMonthlySubscriptionIncome(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getMonthlyExpenses(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getTotalMonthlyIncomes(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getTotalMonthlyBalance(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  const getMonthlySubscriptionIncome = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_GET_MONTHLY_SUBSCRIPTION_INCOME + academyId, {
        signal: controller.signal,
      });
      const data = response?.data;
      isMounted && setMonthlySubscriptionIncome(data);
     
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie mo??na pobra?? przychod??w ze sk??adek");
      };
    }
  };

  const getMonthlyExpenses = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_GET_MONTHLY_EXPENSES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data;
      isMounted && setMonthlyExpenses(data);
     
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie mo??na pobra?? warto???? wydatk??w");
      };
    }
  };

  const getTotalMonthlyIncomes = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_GET_TOTAL_MONTHLY_INCOMES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data;
      isMounted && setTotalMonthlyIncomes(data);
     
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie mo??na pobra?? bilansu pieni????nego");
      };
    }
  };
  const getTotalMonthlyBalance = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_GET_TOTAL_MONTHLY_BALANCE + academyId, {
        signal: controller.signal,
      });
      const data = response?.data;
      isMounted && setTotalMonthlyBalance(data);
     
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie mo??na pobra?? wszystkich przychod??w");
      };
    }
  };

  return (
    <div className="balance-container">
      <div className="balance-component">
        <label htmlFor="balanceSubscriptions">Miesi??czny zysk ze sk??adek: {monthlySubscriptionIncome} z??</label>
      </div>
      <div className="balance-component">
        <label htmlFor="balanceExpenses">Miesi??czne wydatki: {monthlyExpenses} z??</label>
      </div>
      <div className="balance-component">
        <label htmlFor="balanceMontlhyIncome">Miesi??czny zysk og????em: {totalMonthlyIncomes} z??</label>
      </div>
      <div className="balance-component">
        <label htmlFor="montlhyBalance">Miesi??czny bilans: {monthlyBalance} z??</label>
      </div>
    </div>
  );
};

export default MonthlyBalancePage;
