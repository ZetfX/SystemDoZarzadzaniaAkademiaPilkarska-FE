import "./../../App.scss";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";

const AddGrade = () => {
  const API_ADD_PLAYER_GRADE = "/grades/addPlayerGrade";
  const API_ADD_COACH_GRADE = "/grades/addCoachGrade";
  
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const academyId = user.academy.id;
  const axiosPrivate = useAxiosPrivate();


  const [id,setId]=useState()

  const [name,setName]=useState();
  const [surname,setSurname] = useState();
  const [currentDate,setCurrentDate] = useState(new Date());

  const [gradeText,setGradeText] = useState("");
  const [validGradeText,setValidGradeText] = useState(false);

  const [userRole,setUserRole] = useState();




  const datetoString = ()  =>{

    var mm = currentDate.getMonth() + 1
    var yyyy = currentDate.getFullYear();

    var today = mm + '/' + yyyy;

    return today
  }
  

  useEffect(() => {
    setId(location.state[0].id)
  }, []);

  useEffect(() => {
    setUserRole(location.state[0].user.userRole)
  }, []);

  useEffect(() => {
    setName(location.state[0].user.name)
  }, []);

  useEffect(() => {
    setSurname(location.state[0].user.surname)
  }, []);

  const notifySuccess = (text) => {
    toast.success(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const notifyError = (text) => {
    toast.error(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const addPlayerGrade = async (e) => {
    try {
      e.preventDefault();
      const response = await axiosPrivate.post(
        API_ADD_PLAYER_GRADE,
        JSON.stringify({
          gradeText,
          dateOfGrade: currentDate,
          playerId: id
        })
      );
      notifySuccess("Pomyślnie dodano ocenę");
      navigate(-1);
    }
       catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie można dodać oceny");
      }
    }
  };


  const addCoachGrade = async (e) => {
    try {
      e.preventDefault();
      const response = await axiosPrivate.post(
        API_ADD_COACH_GRADE,
        JSON.stringify({
          gradeText,
          dateOfGrade: currentDate,
          coachId: id
        })
      );
      notifySuccess("Pomyślnie dodano ocenę ");
      navigate(-1);
    }
       catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie można dodać oceny");
      }
    }
  };

  useEffect(() => {
    const result = gradeText.length > 0
    setValidGradeText(result);
  }, [gradeText]);

  
console.log(location.state);
console.log(currentDate)

  return (
    <>
      <div className="modal-wrapper-textarea">
        <div className="add-form">
          <h1 className="add-form-title">{userRole === "COACH" ? "Ocena Trenera: " : "Ocena zawodnika:"} {name + " " +surname}</h1>
          <h2 className="add-form-subtitle"> Za miesiąc: {datetoString()}</h2>
          
          <div className="add-form-group">
            <textarea onChange={(e) => setGradeText(e.target.value)} ></textarea>
          </div>

          <div className="add-form-button">
            <button
              className="btn"
              disabled={!validGradeText ? true : false}
              onClick={userRole === "COACH"  ?  addCoachGrade: addPlayerGrade }
              
            >
              Dodaj ocenę
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default AddGrade;
