import "../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ObjectsTable from "../dataTable/objectsTable";
import AddObjectForm from "./addObjectForm";

const API_DELETE_OBJECT = "/admin-coach/deleteObject/";
const API_ALL_OBJECTS = "/admin-coach/allObjects/";

const Objects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [data, setData] = useState([]);

  const [selectedObject, setSelectedObject] = useState([]);
  const [prevSelectedObject, setPrevSelectedObject] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    getAllAcademyObjects(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllAcademyObjects(isMounted, controller);
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

  const getAllAcademyObjects = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_ALL_OBJECTS + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.objects;
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
    setSelectedObject(state.selectedRows);
    if (prevSelectedObject.length > 0) {
      setPrevSelectedObject([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedObject.length > 0) {
      setPrevSelectedObject(selectedObject);
    }
    setSelectedObject([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedObject.length === 0) {
      if (prevSelectedObject.length === 0) {
        notifyError("Należy wybrać obiekt z listy");
        return;
      }
      setSelectedObject(prevSelectedObject);
    }

    setShowModal(true);
    setBlur(true);
    setIsEdit(true);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };


  const handleOutsideClick = (e) => {
    setShowModal(false);
    setBlur(false);
    document
      .getElementById("main")
      .removeEventListener("click", handleOutsideClick);
    setClearSelections();
    setSelectedObject([]);
  };

  const handleDeleteClick = async (e) => {
    try {
      e.stopPropagation();
      if (selectedObject.length === 0) {
        if (prevSelectedObject.length === 0) {
          notifyError("Należy wybrać obiekt z listy");
          return;
        }
        setSelectedObject(prevSelectedObject);
      }
      const objectId = selectedObject[0].id;
      const response = await axiosPrivate.delete(API_DELETE_OBJECT + objectId);
      setSelectedObject([]);
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
              <AddObjectForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                object={selectedObject}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Obiekty</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick}>
                  Dodaj obiekt
                </button>
                <button className="btn" onClick={handleEditClick} >
                  Edytuj obiekt
                </button>
                <button className="btn" onClick={handleDeleteClick} hidden={user.role ==='ADMIN' ? "" : "hidden"}>
                  Usuń obiekt
                </button>
              </div>
              <ObjectsTable
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

export default Objects;
