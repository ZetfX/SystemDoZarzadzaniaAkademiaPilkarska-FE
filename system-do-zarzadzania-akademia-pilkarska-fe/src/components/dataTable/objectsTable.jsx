import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";

const ObjectsTable = (props) => {
  theme();

  const columns = [
    {
      name: "Nazwa miejsca",
      selector: (row) => row.placeName,
    },
    {
      name: "Ulica",
      selector: (row) => row.street,
    },
    {
      name: "Miasto",
      selector: (row) => row.city,
    },
    {
      name: "Kod pocztowy",
      selector: (row) => row.zipCode,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={props.data}
      theme="aqua"
      selectableRows
      noDataComponent="Brak obiektów"
      selectableRowsHighlight
      selectableRowsRadio="radio"
      selectableRowsSingle
      onSelectedRowsChange={props.onSelectedRowsChange}
      clearSelectedRows={props.clearSelectedRows}
    />
  );
};
export default ObjectsTable;
