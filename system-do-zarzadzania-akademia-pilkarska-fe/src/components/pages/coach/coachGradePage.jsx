import "../../../App.scss";
import PlayersGradesTable from "../../dataTable/playersGradesTable";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const API_NOT_GRADED_PLAYERS = "grades/getNotGradedPlayers/";

const CoachGrades = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [prevSelectedPlayer, setPrevSelectedPlayer] = useState([]);


  const [clearSelection, setClearSelection] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
   
      getNotGradedPlayers(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

 

  const getNotGradedPlayers = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_NOT_GRADED_PLAYERS + userId, {
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

  
  const handleChange = (state) => {
    setSelectedPlayer(state.selectedRows);
    if (prevSelectedPlayer.length > 0) {
      setPrevSelectedPlayer([]);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    navigate(location.pathname + "/addGrade", { state: 
        selectedPlayer 
    });
    if (selectedPlayer.length > 0) {
      setPrevSelectedPlayer(selectedPlayer);
    }
    setSelectedPlayer([]);
  };

 


  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div
            id="main"
            className="main-container"
          >
            <header className="header">Zawodnicy do oceny za bieżący miesiąc</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleClick} disabled={selectedPlayer.length != 0 ? "" : "disabled"}>
                  Oceń zawodnika
                </button>
              </div>
              <PlayersGradesTable
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

export default CoachGrades;
