import "./../../App.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SeeGrade = () => {
  
  
  
  const location = useLocation();


  const user = JSON.parse(localStorage.getItem("user"));
  const academyId = user.academy.id;



 

   const formatDate = ()  =>{

    var date=location.state[0].dateOfGrade 
    date = date.replace(/-/g,'/')
    date = date.slice(3)
    if(Array.from(date)[0] == "0")
    {
       date = date.slice(1)
    }

    //var today = mm + '/' + yyyy;

     return date
   }
  
  

 
  
  

  return (
    <>
      <div className="modal-wrapper-textarea">
        <div className="add-form">
        <h1 className="add-form-title">{user.role ==="ADMIN" ? location.state[0].coach.user.name +" " + location.state[0].coach.user.surname : ""} </h1>
          <h1 className="add-form-title"> Za miesiąc: {formatDate()}</h1>
          <div className="add-form-group">
            <textarea readOnly >{location.state[0].gradeText}</textarea>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default SeeGrade;
