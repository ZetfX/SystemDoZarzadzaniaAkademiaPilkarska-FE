import "../../../App.scss";
import PlayersGradesTable from "../../dataTable/playersGradesTable";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CoachesGradesTable from "../../dataTable/coachesGradesTable";

const API_ALL_COACHES_GRADES = "grades/getAllCoachesGrades/";

const AllCoachesGrades = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [selectedGrade, setSelectedGrade] = useState([]);
  const [prevSelectedGrade, setPrevSelectedGrade] = useState([]);


  const [clearSelection, setClearSelection] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
   
      getAllCoachesGrades(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

 

  const getAllCoachesGrades = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_ALL_COACHES_GRADES + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.grades;
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
        setErrMsg("Nie można pobrać ocen");
      }
      console.log(errMsg);
    }
  };

  
  const handleChange = (state) => {
    setSelectedGrade(state.selectedRows);
    if (prevSelectedGrade.length > 0) {
      setPrevSelectedGrade([]);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    navigate(location.pathname + "/seeGrade", { state: 
        selectedGrade 
    });
    if (selectedGrade.length > 0) {
      setPrevSelectedGrade(selectedGrade);
    }
    setSelectedGrade([]);
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
            <header className="header">Oceny Trenerów</header>

            <div className="dataTable-container">
              <div className="buttons-container">
                <button className="btn" onClick={handleClick} disabled={selectedGrade.length != 0 ? "" : "disabled"}>
                  Podgląd Oceny
                </button>
              </div>
              <CoachesGradesTable
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

export default AllCoachesGrades;
