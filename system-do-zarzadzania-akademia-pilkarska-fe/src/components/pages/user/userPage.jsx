import NavigationBarUser from "../../navbar/navigationBarUser"
import {Route, Routes} from "react-router-dom"

import Events from "../eventsPage"

import Grades from "../gradesPage"

import ChangePassword from "../changePassword"



const UserPage = () => {
    return (
        <div className ="super-container">
        <div className="nav">
        <NavigationBarUser/>
        </div>
        <div className ="page-content">
        <Routes>
            <Route path="/events"  element = {<Events/>}/>
            <Route path="/grades" element = {<Grades/>}/>
            <Route path="/changePassword" element = {<ChangePassword/>}/>
        </Routes>
        </div>
        </div>
    )
}
export default UserPage