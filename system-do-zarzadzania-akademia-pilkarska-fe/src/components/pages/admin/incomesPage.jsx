import "../../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import IncomesTable from "../../dataTable/IncomesTable";
import AddIncomeForm from "./addIncomeForm";


const API_DELETE_INCOME = "/admin/deleteIncome/";
const API_All_INCOMES =  "/admin/getAllIncomes/";

const Incomes = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);


  const [data, setData] = useState([]);

  const [selectedIncome, setSelectedIncome] = useState([]);
  const [prevSelectedIncome, setPrevSelectedIncome] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    getAllIncomes(isMounted,controller);
    return () => {isMounted =false;
    controller.abort();
    }
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllIncomes(isMounted,controller);
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


  const getAllIncomes = async (isMounted,controller) => {
    try {
      const response = await axiosPrivate.get(API_All_INCOMES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.incomes;
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
        setErrMsg("Nie można pobrać przychodów");
      }
     console.log(errMsg);
    }
  };

  const setClearSelections = () =>{
    setClearSelection(!clearSelection);
  }
  const handleChange = (state) => {
    setSelectedIncome(state.selectedRows);
    if (prevSelectedIncome.length > 0) {
      setPrevSelectedIncome([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedIncome.length > 0) {
      setPrevSelectedIncome(selectedIncome);
    }
    setSelectedIncome([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedIncome.length === 0) {
      if (prevSelectedIncome.length === 0) {
        notifyError("Należy wybrać przychód z listy");
        return;
      }
      setSelectedIncome(prevSelectedIncome);
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
    setSelectedIncome([])
  };

  const handleDeleteClick = async (e) => {
    try{
    e.stopPropagation();
    if (selectedIncome.length === 0) {
      if (prevSelectedIncome.length === 0) {
        notifyError("Należy wybrać przychód z listy");
        return;
      }
      setSelectedIncome(prevSelectedIncome);
    }
    const incomeId= selectedIncome[0].id
    const response = await axiosPrivate.delete(
      API_DELETE_INCOME + incomeId,
    )
    setSelectedIncome([])
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
        notifyError("Nie można usunąć przychodu");
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
              <AddIncomeForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                income={selectedIncome}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Przychody (bez składek)</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick}>
                  Dodaj przychód
                </button>
                <button className="btn" onClick={handleEditClick}>
                  Edytuj przychód
                </button>
                <button className="btn" onClick={handleDeleteClick}>Usuń przychód</button>
              </div>
              <IncomesTable data={data} onSelectedRowsChange={handleChange} clearSelectedRows={clearSelection} />
            </div>
            <ToastContainer />
          </div>
        </>
      )}
      ;
    </>
  );
};

export default Incomes;
