import "../../../App.scss";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CoachesTable from "../../dataTable/coachesTable";

const API_NOT_GRADED_PLAYERS = "grades/getNotGradedCoaches/";

const UserGrades = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [selectedCoach, setSelectedCoach] = useState([]);
  const [prevSelectedCoach, setPrevSelectedCoach] = useState([]);


  const [clearSelection, setClearSelection] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
   
      getNotGradedCoaches(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

 

  const getNotGradedCoaches = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_NOT_GRADED_PLAYERS + userId, {
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
        setErrMsg("Nie można pobrać zawodników");
      }
      console.log(errMsg);
    }
  };

  
  const handleChange = (state) => {
    setSelectedCoach(state.selectedRows);
    if (prevSelectedCoach.length > 0) {
      setPrevSelectedCoach([]);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    navigate(location.pathname + "/addGrade", { state: 
        selectedCoach 
    });
    if (selectedCoach.length > 0) {
      setPrevSelectedCoach(selectedCoach);
    }
    setSelectedCoach([]);
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
            <header className="header">Trenerzy do oceny za bieżący miesiąc</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleClick} disabled={selectedCoach.length != 0 ? "" : "disabled"}>
                  Oceń Trenera
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

export default UserGrades;
