import "../../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import GroupsTable from "../../dataTable/trainingGroupsTable";
import AddTrainingGroupForm from "./addTrainingGroupForm";

const API_DELETE_GROUP = "/admin/deleteTrainingGroup/";
const API_All_TRAINING_GROUPS = "/admin/allTrainingGroups/";

const TrainingGroups = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [data, setData] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState([]);
  const [prevSelectedGroup, setPrevSelectedGroup] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    getAllAcademyTrainingGroups(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllAcademyTrainingGroups(isMounted, controller);
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

  const getAllAcademyTrainingGroups = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_All_TRAINING_GROUPS + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.trainingGroups;
      console.log(data)
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
        setErrMsg("Nie można pobrać grup treningowych");
      }
      errorRef.current.focus();
    }
  };

  const setClearSelections = () => {
    setClearSelection(!clearSelection);
  };
  const handleChange = (state) => {
    setSelectedGroup(state.selectedRows);
    if (prevSelectedGroup.length > 0) {
      setPrevSelectedGroup([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedGroup.length > 0) {
      setPrevSelectedGroup(selectedGroup);
    }
    setSelectedGroup([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedGroup.length === 0) {
      if (prevSelectedGroup.length === 0) {
        notifyError("Należy wybrać grupę treningową z listy");
        return;
      }
      setSelectedGroup(prevSelectedGroup);
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
    setSelectedGroup([]);
  };

  const handleDeleteClick = async (e) => {
    try {
      e.stopPropagation();
      if (selectedGroup.length === 0) {
        if (prevSelectedGroup.length === 0) {
          notifyError("Należy wybrać grupę treningową z listy");
          return;
        }
        setSelectedGroup(prevSelectedGroup);
      }
      const groupId = selectedGroup[0].id;
      const response = await axiosPrivate.delete(API_DELETE_GROUP + groupId
      );
      setSelectedGroup([]);
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
        notifyError("Nie można usunąć grupy teningowej");
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
              <AddTrainingGroupForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                trainingGroup={selectedGroup}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Grupy Treningowe</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick}>
                  Dodaj Grupę
                </button>
                <button className="btn" onClick={handleEditClick}>
                  Edytuj grupę
                </button>
                <button className="btn" onClick={handleDeleteClick}>
                  Usuń Grupę
                </button>
              </div>
              <GroupsTable
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

export default TrainingGroups;
