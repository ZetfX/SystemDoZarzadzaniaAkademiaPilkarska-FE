import "../../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AddIncomeForm from "./addIncomeForm";
import ExpensesTable from "../../dataTable/expensesTable";
import AddExpenseForm from "./addExpenseForm";


const API_DELETE_EXPENSE = "/admin/deleteExpense/";
const API_All_EXPENSES =  "/admin/getAllExpenses/";

const Expenses = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);


  const [data, setData] = useState([]);

  const [selectedExpense, setSelectedExpense] = useState([]);
  const [prevSelectedExpense, setPrevSelectedExpense] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    getAllExpenses(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllExpenses(isMounted,controller);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setBlur(false);
    setClearSelections();
  }
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


  const getAllExpenses = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_All_EXPENSES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.expenses;
      isMounted && setData(data);
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        setErrMsg(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        setErrMsg("Nie można pobrać wydatków");
      }
     console.log(errMsg);
    }
  };

  const setClearSelections = () =>{
    setClearSelection(!clearSelection);
  }
  const handleChange = (state) => {
    setSelectedExpense(state.selectedRows);
    if (prevSelectedExpense.length > 0) {
      setPrevSelectedExpense([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedExpense.length > 0) {
      setPrevSelectedExpense(selectedExpense);
    }
    setSelectedExpense([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedExpense.length === 0) {
      if (prevSelectedExpense.length === 0) {
        notifyError("Należy wybrać wydatek z listy");
        return;
      }
      setSelectedExpense(prevSelectedExpense);
    }

    setShowModal(true);
    setBlur(true);
    setIsEdit(true);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  useEffect(() => {});

  const handleOutsideClick = (e) => {
    setShowModal(false);
    setBlur(false);
    document
      .getElementById("main")
      .removeEventListener("click", handleOutsideClick);
    setClearSelections()
    setSelectedExpense([])
  };

  const handleDeleteClick = async (e) => {
    try{
    e.stopPropagation();
    if (selectedExpense.length === 0) {
      if (prevSelectedExpense.length === 0) {
        notifyError("Należy wybrać wydatek z listy");
        return;
      }
      setSelectedExpense(prevSelectedExpense);
    }
    const incomeId= selectedExpense[0].id
    const response = await axiosPrivate.delete(
      API_DELETE_EXPENSE + incomeId,
    )
    setSelectedExpense([])
    reloadData()
    notifySuccess(response?.data?.message)
    }
    catch(error){
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie można usunąć wydatku");
      }
    }

  }

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="modal-wrapper">
            {showModal && (
              <AddExpenseForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                expense={selectedExpense}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Wydatki</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick}>
                  Dodaj wydatek
                </button>
                <button className="btn" onClick={handleEditClick}>
                  Edytuj wydatek
                </button>
                <button className="btn" onClick={handleDeleteClick}>Usuń wydatek</button>
              </div>
              <ExpensesTable data={data} onSelectedRowsChange={handleChange} clearSelectedRows={clearSelection} />
            </div>
            <ToastContainer />
          </div>
        </>
      )}
      ;
    </>
  );
};

export default Expenses;
