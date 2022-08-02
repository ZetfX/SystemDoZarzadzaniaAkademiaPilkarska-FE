import "./../../App.scss";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";

const ChangePassword = () => {
  const API_CHANGE_PASSWORD = "/api/auth/changePassword/";
  const PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$"

  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const academyId = user.academy.id;
  const axiosPrivate = useAxiosPrivate();

  const newPasswordRef = useRef();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmFocus, setPasswordConfirmFocus] = useState(false);

  const [validPassword, setValidPassword] = useState();
  const [isPasswordsSame, setIsPasswordsSame] = useState();

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

  const changePassword = async (e) => {
    try {
      e.preventDefault();
      const response = await axiosPrivate.post(
        API_CHANGE_PASSWORD + user.id,
        JSON.stringify({
          newPassword,
        })
      );
      notifySuccess("Pomyślnie zmieniono hasło");
    } catch (error) {
      if (!error?.response) {
        notifyError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        notifyError("Nie można dodać grupy treningowej");
      }
    }
  };

  useEffect(() => {
    const result = new RegExp(PASSWORD_REGEX).test(newPassword);
    setValidPassword(result);
  }, [newPassword]);

  useEffect(() => {
    var result = false;
    if(passwordConfirm.length > 0)
    {
    result = (newPassword === passwordConfirm);
    }
    setIsPasswordsSame(result);
  }, [newPassword,passwordConfirm]);



  return (
    <>
      <div className="modal-wrapper">
        <div className="add-form">
          <h1 className="add-form-title">Zmień hasło</h1>
          <div className="add-form-group">
            <label htmlFor="newPassword">Nowe hasło</label>
            <input
              type="password"
              name="newPassword"
              placeholder="nowe hasło"
              autoComplete="off"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              pattern={PASSWORD_REGEX}
              value={newPassword}
              ref={newPasswordRef}
              onBlur={(e) => setNewPasswordFocus(true)}
              focused={newPasswordFocus.toString()}
            ></input>
            <span>
              Hasło musi zawierać przynajmniej jedna duża literę, jedna małą
              literę, jedną cyfrę, ma mieć długość od 8 do 24 znaków
            </span>
          </div>
          <div className="add-form-group">
            <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="potwierdź hasło"
              autoComplete="off"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm} 
              required
              onBlur={(e) => setPasswordConfirmFocus(true)}
              focused={passwordConfirmFocus.toString()}
            ></input>
            <text className={isPasswordsSame || !passwordConfirmFocus ? "hidden" : "nohidden"} >
              Hasła muszą być jednakowe
            </text>
          </div>

          <div className="add-form-button">
            <button
              className="btn"
              disabled={!validPassword || !isPasswordsSame ? true : false}
              onClick={changePassword}
              
            >
              Zmień hasło
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default ChangePassword;
