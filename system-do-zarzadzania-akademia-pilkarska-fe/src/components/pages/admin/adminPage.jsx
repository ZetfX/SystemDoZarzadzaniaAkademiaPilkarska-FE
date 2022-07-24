import NavigationBarAdmin from "../../navbar/navigationBarAdmin"
import {Route, Routes} from "react-router-dom"
import Players from "../playersPage"
import Events from "../eventsPage"
import TrainingGroups from "./trainingGroupsPage"
import Coaches from "./coachesPage"
import Objects from "../objectsPage"
import Grades from "../gradesPage"
import PersistLogin from "../../PersistLogin"
import BalanceTabPage from "./balanceTabPage"
import ChangePassword from "../changePassword"

const AdminPage = () => {
    return (
        
        <div className ="super-container">
        <div className="nav">
        <NavigationBarAdmin/>
        </div>
        <div className ="page-content">
        <Routes>
            <Route element ={<PersistLogin />}>
            <Route path="/events"  element = {<Events/>}/>
            <Route path="/players" element = {<Players/>}/>
            <Route path="/training-groups" element = {<TrainingGroups/>}/>
            <Route path="/coaches" element = {<Coaches/>}/>
            <Route path="/objects" element = {<Objects/>}/>
            <Route path="/grades" element = {<Grades/>}/>
            <Route path="/balance-financial" element = {<BalanceTabPage/>}/>
            <Route path ="/changePassword" element={<ChangePassword />} />
            </Route>
        </Routes>
        </div>
        </div>

    )
}
export default AdminPage