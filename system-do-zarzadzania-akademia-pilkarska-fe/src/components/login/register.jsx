import React from "react";
import AuthService from "../../services/authService";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../App.scss";

const EMAIL_REGEX =/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const NAME_SURNAME_REGEX = /([A-ZĄĆĘŁŃÓŚŹŻ][-,a-ząćęłńóśTtUuWwYyZzŹźŻż. ']+[ ]*)+/

const Register = () => {
  const emailRef = useRef();
  const errorRef = useRef();
  const nameRef = useRef();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [surname, setSurname] = useState("");
  const [validSurname, setValidSurname] = useState(false);
  const [surnameFocus, setSurnameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = NAME_SURNAME_REGEX.test(name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = NAME_SURNAME_REGEX.test(surname);
    setValidSurname(result);
  }, [surname]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(pwd);
    setValidPwd(result);
  }, [pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [name, surname, email, pwd]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const v1 = NAME_SURNAME_REGEX.test(name);
    const v2 = NAME_SURNAME_REGEX.test(surname);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PASSWORD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Niepoprawne dane");
      return;
    }
    try {
      const response = await AuthService.register(name, surname, email, pwd);
      setSuccess(true);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error.response.status === 409) {
        setErrMsg(error.response.data.message);
      } else {
        setErrMsg("Rejestracja nie powiodła się");
      }
      errorRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className="base-container">
          <div className="header">Pomyślnie Zarejestrowano</div>
        </div>
      ) : (
        <div className="base-container">
          <p
            ref={errorRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div className="header">Rejestracja</div>

          <div className="content">
            <div className="form">
              <div className="form-group">
                <label htmlFor="name">
                  Imię:
                  <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validName || !name ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="imię"
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  required
                  ref={nameRef}
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    nameFocus && name && !validName
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Musi zawierać same litery z czego tylko <br />
                  jedną dużą
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="surname">
                  Nazwisko:
                  <span className={validSurname ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={validSurname || !surname ? "hide" : "invalid"}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="text"
                  name="surname"
                  placeholder="nazwisko"
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setSurnameFocus(true)}
                  onBlur={() => setSurnameFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    surnameFocus && surname && !validSurname
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Musi zawierać same litery z czego tylko <br />
                  jedną dużą
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  Email:
                  <span className={validEmail ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validEmail || !email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  ref={emailRef}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    emailFocus && email && !validEmail
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  To nie jest prawidłowy email
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Hasło:{" "}
                  <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validPwd || !pwd ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="hasło"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Hasło musi zawierać przynajmniej jedna duża literę, <br />
                  jedna małą literę, jedną cyfrę, <br />
                  ma mieć długość od 8 do 24 znaków
                </p>
              </div>
            </div>
          </div>
          <div className="footer">
            <button
              type="button"
              disabled={
                !validName || !validSurname || !validEmail || !validPwd
                  ? true
                  : false
              }
              className="btn"
              onClick={handleRegister}
            >
              Rejestruj
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Register;
