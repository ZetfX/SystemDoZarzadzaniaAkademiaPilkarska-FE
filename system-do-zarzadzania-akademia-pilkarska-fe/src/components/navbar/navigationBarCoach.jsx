import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import "../../App.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {faPersonRunning, faSchool,faComment,faDoorOpen,faFutbol,faGraduationCap} from "@fortawesome/free-solid-svg-icons"


const NavigationBarCoach = () => {
  const navigate = useNavigate();
  return (
    <div className ="nav">
      
       
        <div className="navMenu">
        <h1 className="navIcon"><FontAwesomeIcon icon={faFutbol} size={"2x"} /></h1>
        <ul className="list">
        <li className="link">
        <NavLink className="navLink" to="/coach/events">
        <FontAwesomeIcon className="icon" icon={faCalendar} />
          Wydarzenia
        </NavLink>
        </li >
        <li className="link">
        <NavLink className="navLink" to="/coach/players">
            <FontAwesomeIcon className="icon" icon={faPersonRunning} />
         Moi zawodnicy
        </NavLink>
        </li>
        <li className="link">
        <NavLink className="navLink" to="/coach/grades">
        <FontAwesomeIcon className="icon" icon={faGraduationCap} />
          Oceny
        </NavLink>
        </li>
        <li className="link">
        <NavLink className="navLink" to="/coach/objects">
        <FontAwesomeIcon className="icon" icon={faSchool} />
          Obiekty
        </NavLink>
        </li>
        </ul>
        <div className="navBtn">
        <NavLink className="navLink" to="/" onClick={(e) =>{e.preventDefault(); localStorage.clear();  navigate("/", { replace: true });}}>
        <FontAwesomeIcon className="icon" icon={faDoorOpen} />
        Wyloguj
        </NavLink>
        </div>
        </div>
    </div>
  );
};
export default NavigationBarCoach;
