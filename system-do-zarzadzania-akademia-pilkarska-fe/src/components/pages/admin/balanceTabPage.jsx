import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../../../App.scss";
import Expenses from "./expensesPage";
import Incomes from "./incomesPage";
import MonthlyBalancePage from "./monthlyBalancePage";

const BalanceTabPage = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Przychody</Tab>
        <Tab>Wydatki</Tab>
        <Tab>Szacowany bilans za obecny miesiąc</Tab>
      </TabList>

      <TabPanel>
        <Incomes />
      </TabPanel>
      <TabPanel>
        <Expenses />
      </TabPanel>
      <TabPanel>
        <MonthlyBalancePage />
      </TabPanel>
    </Tabs>
  );
};
export default BalanceTabPage;
