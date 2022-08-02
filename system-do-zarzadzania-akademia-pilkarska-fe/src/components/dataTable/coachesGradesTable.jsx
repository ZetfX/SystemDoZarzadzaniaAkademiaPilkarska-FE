import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";


const CoachesGradesTable = (props) => {
    theme()

  const user = JSON.parse(localStorage.getItem("user"));
  const columns = [
    {
      name: "Data wystawienia oceny",
      selector: (row) => row.dateOfGrade,
    },
    {
        name: "Imię",
        selector: (row) => row.coach.user.name,
    },
    {
        name:"Nazwisko",
        selector: (row) => row.coach.user.surname,
    }

  ];
    
  return <DataTable columns={columns} data={props.data}
  theme="aqua"
  selectableRows
  noDataComponent="Brak ocen"
  selectableRowsHighlight
  selectableRowsRadio="radio"
  selectableRowsSingle
  onSelectedRowsChange={props.onSelectedRowsChange}
  clearSelectedRows = {props.clearSelectedRows}
  />;
};
export default CoachesGradesTable
