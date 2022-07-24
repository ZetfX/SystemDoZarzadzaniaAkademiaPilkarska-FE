import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faPersonRunning,
  faPeopleGroup,
  faPerson,
  faSchool,
  faGraduationCap,
  faSackDollar,
  faDoorOpen,
  faFutbol,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

const NavigationBarAdmin = () => {
  const navigate = useNavigate();
  return (
    <div className="nav">
      <div className="navMenu">
        <h1 className="navIcon">
          <FontAwesomeIcon icon={faFutbol} size={"2x"} />
        </h1>
        <ul className="list">
          <li className="link">
            <NavLink className="navLink" to="/admin/events">
              <FontAwesomeIcon className="icon" icon={faCalendar} />
              Wydarzenia
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/players">
              <FontAwesomeIcon className="icon" icon={faPersonRunning} />
              Zawodnicy
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/training-groups">
              <FontAwesomeIcon className="icon" icon={faPeopleGroup} />
              Grupy treningowe
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/coaches">
              <FontAwesomeIcon className="icon" icon={faPerson} />
              Trenerzy
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/objects">
              <FontAwesomeIcon className="icon" icon={faSchool} />
              Obiekty
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/announcements">
              <FontAwesomeIcon className="icon" icon={faGraduationCap} />
              Oceny trenerów
            </NavLink>
          </li>
          <li className="link">
            <NavLink className="navLink" to="/admin/balance-financial">
              <FontAwesomeIcon className="icon" icon={faSackDollar} />
              Bilans pieniężny
            </NavLink>
          </li>
          <li className="link">
        <NavLink className="navLink" to="/admin/changePassword">
        <FontAwesomeIcon className="icon" icon={faCog} />
          Zmień hasło
        </NavLink>
        </li>
        </ul>
        <div className="navBtn">
          <NavLink
            className="navLink"
            to="/"
            onClick={(e) => {
              e.preventDefault();
              localStorage.clear();
              navigate("/", { replace: true });
            }}
          >
            <FontAwesomeIcon className="icon" icon={faDoorOpen} />
            Wyloguj
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default NavigationBarAdmin;
