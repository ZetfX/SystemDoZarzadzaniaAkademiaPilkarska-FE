import "../../App.scss";
import PlayersTable from "../dataTable/playersTable";
import AddPlayerForm from "./admin/addPlayerForm";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const API_DELETE_PLAYER = "/admin/deletePlayer/";

const API_All_PLAYERS = "/admin/allPlayers/";
const API_COACH_PLAYERS = "coach/myPlayers/";

const Players = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [data, setData] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [prevSelectedPlayer, setPrevSelectedPlayer] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    if (user?.role === "ADMIN") {
      getAllAcademyPlayers(isMounted, controller);
    } else {
      getCoachPlayers(isMounted, controller);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reloadData = () => {
    let isMounted = true;
    getAllAcademyPlayers(isMounted, controller);
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

  const getCoachPlayers = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_COACH_PLAYERS + userId, {
        signal: controller.signal,
      });
      const data = response?.data?.players;
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
        setErrMsg("Nie można pobrać zawodników");
      }
      console.log(errMsg);
    }
  };

  const getAllAcademyPlayers = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_All_PLAYERS + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.players;
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
        setErrMsg("Nie można pobrać zawodników");
      }
      console.log(errMsg);
    }
  };

  const setClearSelections = () => {
    setClearSelection(!clearSelection);
  };
  const handleChange = (state) => {
    setSelectedPlayer(state.selectedRows);
    if (prevSelectedPlayer.length > 0) {
      setPrevSelectedPlayer([]);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);
    if (selectedPlayer.length > 0) {
      setPrevSelectedPlayer(selectedPlayer);
    }
    setSelectedPlayer([]);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    if (selectedPlayer.length === 0) {
      if (prevSelectedPlayer.length === 0) {
        notifyError("Należy wybrać zawodnika z listy");
        return;
      }
      setSelectedPlayer(prevSelectedPlayer);
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
    setSelectedPlayer([]);
  };

  const handleDeleteClick = async (e) => {
    try {
      e.stopPropagation();
      if (selectedPlayer.length === 0) {
        if (prevSelectedPlayer.length === 0) {
          notifyError("Należy wybrać zawodnika z listy");
          return;
        }
        setSelectedPlayer(prevSelectedPlayer);
      }
      const playerId = selectedPlayer[0].id;
      const response = await axiosPrivate.delete(API_DELETE_PLAYER + playerId);
      setSelectedPlayer([]);
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
        notifyError("Nie można usunąć zawodnika");
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
              <AddPlayerForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                player={selectedPlayer}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <header className="header">Zawodnicy</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleAddClick} hidden={user.role ==='ADMIN' ? "" : "hidden"}>
                  Dodaj zawodnika
                </button>
                <button className="btn" onClick={handleEditClick} hidden={user.role ==='ADMIN' ? "" : "hidden"}>
                  Edytuj zawodnika
                </button>
                <button className="btn" onClick={handleDeleteClick} hidden={user.role ==='ADMIN' ? "" : "hidden"}>
                  Usuń zawodnika
                </button>
              </div>
              <PlayersTable
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

export default Players;
