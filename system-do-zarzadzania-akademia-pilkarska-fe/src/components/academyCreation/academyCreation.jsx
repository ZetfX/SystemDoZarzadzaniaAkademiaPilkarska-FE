import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState} from "react";
import "../../App.scss";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";



const API_CREATE_ACADEMY =  "/admin/createAcademy";
const SPLITTER = "/";

const CreateAcademy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const errorRef = useRef();
  const academyNameRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const [academyName, setAcademyName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const createAcademy = async (e) => {
    e.preventDefault();
    try {
      const loggedUserEmail = user.email;
      const response = await axiosPrivate.post(
        API_CREATE_ACADEMY,
        JSON.stringify({ loggedUserEmail, academyName })
      );

      const academy = response?.data?.academy;
      user.academy = academy;

      localStorage.setItem("user", JSON.stringify(user));
    
      navigate(SPLITTER + user.role.toLowerCase(), { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error.response.status === 409) {
        setErrMsg(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        setErrMsg("Zalożenie akademii nie powiodło się");
      }
      errorRef.current.focus();
    }
  };

  return (
    <div className="academy-container">
      <div className="academy-form-container">
        <div className="sub-container">
          <div className="base-container">
            <p
              ref={errorRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <div className="header">Załóż Akademie</div>
            <div className="content">
              <div className="form">
                <div className="form-group">
                  <label htmlFor="nazwa-akademii">Nazwa Akademii:</label>
                  <input
                    type="text"
                    name="nazwa-akademii"
                    placeholder="nazwa akademii"
                    ref={academyNameRef}
                    onChange={(e) => setAcademyName(e.target.value)}
                    value={academyName}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="footer">
              <button type="button" className="btn" onClick={createAcademy}>
                Utwórz akademie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateAcademy;
