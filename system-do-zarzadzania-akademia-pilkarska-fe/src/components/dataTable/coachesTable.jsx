import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";

const CoachesTable = (props) => {
  theme();

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
      name: "Email",
      selector: (row) => row.user.email,
    },
    {
      name: "Numer Telefonu",
      selector: (row) => row.telephoneNumber,
    },
    {
        name: "Grupa Treningowa",
        selector: (row) => row.trainingGroup?.groupName,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={props.data}
      theme="aqua"
      selectableRows
      noDataComponent="Brak trenerów"
      selectableRowsHighlight
      selectableRowsRadio="radio"
      selectableRowsSingle
      onSelectedRowsChange={props.onSelectedRowsChange}
      clearSelectedRows={props.clearSelectedRows}
    />
  );
};
export default CoachesTable;
