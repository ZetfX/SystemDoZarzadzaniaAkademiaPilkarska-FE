import React from "react";
import "../../App.scss";
import { useRef, useState, useEffect } from "react";
import AuthService from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import {Link, useNavigate, useLocation } from "react-router-dom";

const ACADEMY_CREATION_PATH = "create-academy";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location?.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, pwd);

      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;
      const role = response?.data?.role;
      const academy = response?.data?.academy;
      const name = response?.data?.name;
      const surname = response?.data?.surname;

      if (accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
     
      setEmail("");
      setPwd("");
      setAuth({ name, surname, email, pwd, accessToken, role, academy,refreshToken });
      if (role === "ADMIN" && academy === null) {
        navigate(from + ACADEMY_CREATION_PATH, { replace: true });
        return;
      }
      navigate(from + role.toLowerCase(), { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error?.response.status === 400) {
        setErrMsg("Brakujący email lub hasło");
      } else if (error?.response.status === 401) {
        setErrMsg("Nieprawidłowy email lub hasło");
      } else {
        setErrMsg("Logowanie nie powiodło się");
      }
      errorRef.current.focus();
    }
  };

  return (
    <div className="base-container">
      <p
        ref={errorRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <div className="header">Logowanie</div>
      <div className="content">
        <div className="form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              placeholder="email"
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło:</label>
            <input
              type="password"
              name="password"
              placeholder="hasło"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
          </div>
        </div>
      </div>
      <div className="footer">
        <button type="button" className="btn" onClick={handleLogin}>
          Zaloguj
        </button>
      </div>
    </div>
  );
};
export default Login;
