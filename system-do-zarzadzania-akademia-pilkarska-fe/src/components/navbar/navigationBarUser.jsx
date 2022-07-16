import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../../App.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {faPersonRunning,faComment,faDoorOpen,faFutbol,faTablet,faGraduationCap} from "@fortawesome/free-solid-svg-icons"


const NavigationBarCoach = () => {
  
  return (
    <div className ="nav">
      
       
        <div className="navMenu">
        <h1 className="navIcon"><FontAwesomeIcon icon={faFutbol} size={"2x"} /></h1>
        <ul className="list">
        <li className="link">
        <NavLink className="navLink" to="/user/events">
        <FontAwesomeIcon className="icon" icon={faCalendar} />
          Wydarzenia
        </NavLink>
        </li >
        <li className="link">
        <NavLink className="navLink" to="/user/my-coaches">
            <FontAwesomeIcon className="icon" icon={faPersonRunning} />
         Moi trenerzy
        </NavLink>
        </li>
        <li className="link">
        <NavLink className="navLink" to="/user/grades">
        <FontAwesomeIcon className="icon" icon={faGraduationCap} />
          Oceny
        </NavLink>
        </li>
        </ul>
        <div className="navBtn">
        <NavLink className="navLink" to="/" onClick={(e) => {localStorage.clear();}  }>
        <FontAwesomeIcon className="icon" icon={faDoorOpen} />
        Wyloguj
        </NavLink>
        </div>
        </div>
    </div>
  );
};
export default NavigationBarCoach;
