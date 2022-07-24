import NavigationBarCoach from "../../navbar/navigationBarCoach";
import { Route, Routes } from "react-router-dom";
import Events from "../eventsPage";
import Objects from "../objectsPage";
import PersistLogin from "../../PersistLogin";
import Grades from "../gradesPage";
import Players from "../playersPage";
import ChangePassword from "../changePassword";

const CoachPage = () => {
  return (
    <div className="super-container">
      <div className="nav">
        <NavigationBarCoach />
      </div>
      <div className="page-content">
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/events" element={<Events />} />
            <Route path="/objects" element={<Objects />} />
            <Route path="/players" element={<Players />} />
            <Route path="/grades" element={<Grades />} />
            <Route path ="/changePassword" element={<ChangePassword />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};
export default CoachPage;
