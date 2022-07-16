import NavigationBarCoach from "../../navbar/navigationBarCoach"
import {Route, Routes} from "react-router-dom"

import Events from "../eventsPage"

import Grades from "../gradesPage"



const UserPage = () => {
    return (
        <div className ="super-container">
        <div className="nav">
        <NavigationBarCoach/>
        </div>
        <div className ="page-content">
        <Routes>
            <Route path="/events"  element = {<Events/>}/>
            <Route path="/grades" element = {<Grades/>}/>
        </Routes>
        </div>
        </div>
    )
}
export default UserPage