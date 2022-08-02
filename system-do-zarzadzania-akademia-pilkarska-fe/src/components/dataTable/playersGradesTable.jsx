import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";


const PlayersGradesTable = (props) => {
    theme()

  const user = JSON.parse(localStorage.getItem("user"));
  const columns = [
    {
      name: "Imię",
      selector: (row) => row.user.name,
    },
    {
      name: "Nazwisko",
      selector: (row) => row.user.surname,
    },
    {
      name: "Płeć",
      selector: (row) => row.gender,
    },
    {
      name: "Email",
      selector: (row) => row.user.email,
    },
    {
      name: "Data Urodzenia",
      selector: (row) => row.dateOfBirth,
    },
    {
      name: "Grupa Treningowa",
      selector: (row) => row.trainingGroup?.groupName,
    },
  ];
    
  return <DataTable columns={columns} data={props.data}
  theme="aqua"
  selectableRows
  noDataComponent="Brak zawodników"
  selectableRowsHighlight
  selectableRowsRadio="radio"
  selectableRowsSingle
  onSelectedRowsChange={props.onSelectedRowsChange}
  clearSelectedRows = {props.clearSelectedRows}
  />;
};
export default PlayersGradesTable
