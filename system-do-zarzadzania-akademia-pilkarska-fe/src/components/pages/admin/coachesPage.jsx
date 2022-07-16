import "../../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CoachesTable from "../../dataTable/coachesTable";
import AddCoachForm from "./addCoachForm";

const API_DELETE_COACH = "/admin/deleteCoach/";
const API_ALL_COACHES = "/admin/allCoaches/";

const Coaches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [data, setData] = useState([]);

  const [selectedCoach, setSelectedCoach] = useState([]);
  const [prevSelectedCoach, setPrevSelectedCoach] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    getAllAcademyCoaches(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllAcademyCoaches(isMounted, controller);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setBlur(false);
    setClearSelections();
  };
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

  const getAllAcademyCoaches = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_ALL_COACHES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.coaches;
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
        setErrMsg("Nie można pobrać obiektów");
      }
      errorRef.current.focus();
    }
  };

  const setClearSelections = () => {
    setClearSelection(!clearSelection);
  };
  const handleChange = (state) => {
    setSelectedCoach(state.selectedRows);
    if (prevSelectedCoach.length > 0) {
      setPrevSelectedCoach([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedCoach.length > 0) {
      setPrevSelectedCoach(selectedCoach);
    }
    setSelectedCoach([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedCoach.length === 0) {
      if (prevSelectedCoach.length === 0) {
        notifyError("Należy wybrać obiekt z listy");
        return;
      }
      setSelectedCoach(prevSelectedCoach);
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
    setClearSelections();
    setSelectedCoach([]);
  };

  const handleDeleteClick = async (e) => {
    try {
      e.stopPropagation();
      if (selectedCoach.length === 0) {
        if (prevSelectedCoach.length === 0) {
          notifyError("Należy wybrać obiekt z listy");
          return;
        }
        setSelectedCoach(prevSelectedCoach);
      }
      const coachId = selectedCoach[0].id;
      const response = await axiosPrivate.delete(API_DELETE_COACH + coachId);
      setSelectedCoach([]);
      reloadData();
      notifySuccess(response?.data?.message);
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie można usunąć obiektu");
      }
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="modal-wrapper">
            {showModal && (
              <AddCoachForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                coach={selectedCoach}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Trenerzy</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick}>
                  Dodaj trenera
                </button>
                <button className="btn" onClick={handleEditClick}>
                  Edytuj trenera
                </button>
                <button className="btn" onClick={handleDeleteClick}>
                  Usuń trenera
                </button>
              </div>
              <CoachesTable
                data={data}
                onSelectedRowsChange={handleChange}
                clearSelectedRows={clearSelection}
              />
            </div>
            <ToastContainer />
          </div>
        </>
      )}
      ;
    </>
  );
};

export default Coaches;
