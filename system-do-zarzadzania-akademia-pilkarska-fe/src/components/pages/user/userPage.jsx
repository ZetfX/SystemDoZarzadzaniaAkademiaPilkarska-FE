import NavigationBarUser from "../../navbar/navigationBarUser";
import { Route, Routes } from "react-router-dom";

import Events from "../eventsPage";

import UserGradeTabPage from "./userGradeTabPage";

import ChangePassword from "../changePassword";
import AddGrade from "../addGrade";
import SeeGrade from "../seeGrade";

const UserPage = () => {
  return (
    <div className="super-container">
      <div className="nav">
        <NavigationBarUser />
      </div>
      <div className="page-content">
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/grades" element={<UserGradeTabPage />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/grades/addGrade" element={<AddGrade />} />
          <Route path="/grades/seeGrade" element={<SeeGrade />} />
        </Routes>
      </div>
    </div>
  );
};
export default UserPage;
