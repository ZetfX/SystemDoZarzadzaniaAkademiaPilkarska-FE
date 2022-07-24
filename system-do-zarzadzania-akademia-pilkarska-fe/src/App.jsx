import React from "react";
import "./App.scss";
import PeristLogin from "./components/PersistLogin";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import LoginRegister from "./components/login";
import RequireAuth from "./components/requireAuth";
import UnauthorizedPage from "./components/pages/unauthorizedPage";
import CreateAcademy from "./components/academyCreation/academyCreation";
import AdminPage from "./components/pages/admin/adminPage";
import CoachPage from "./components/pages/coach/coachPage";
import UserPage from "./components/pages/user/userPage";
import MissingPage from "./components/pages/missingPage";

const ROLES = {
  Admin: "ADMIN",
  User: "CASUAL_USER",
  Coach: "COACH",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*public route */}
       
        <Route path="/" element={<LoginRegister />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/*secured routes */}
        <Route element={<PeristLogin/>}>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="create-academy" element={<CreateAcademy />} />
          <Route path="admin/*" element={<AdminPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Coach]} />}>
          <Route path="coach/*" element={<CoachPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="casual_user/*" element={<UserPage />} />
        </Route>
        </Route>
        {/*catch all */}
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}
export default App;
