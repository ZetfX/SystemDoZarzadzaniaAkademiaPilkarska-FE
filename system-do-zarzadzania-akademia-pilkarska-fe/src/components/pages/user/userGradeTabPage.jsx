import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../../../App.scss";
import UserGrades from "./userGradePage";
import UserMyGrades from "./userMyGradesPage";

const UserGradeTabPage = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Oceń Trenera</Tab>
        <Tab>Moje Oceny</Tab>
       
      </TabList>

      <TabPanel>
        <UserGrades />
      </TabPanel>
      <TabPanel>
        <UserMyGrades />
      </TabPanel>
      
    </Tabs>
  );
};
export default UserGradeTabPage;
