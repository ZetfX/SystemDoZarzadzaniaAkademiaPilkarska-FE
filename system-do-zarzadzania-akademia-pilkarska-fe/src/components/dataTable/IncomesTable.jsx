import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";


const IncomesTable = (props) => {
    theme()

    
  const columns = [
    {
      name: "Tytuł",
      selector: (row) => row.title,
    },
    {
      name: "Wartość (w zł)",
      selector: (row) => row.value,
    },
    {
      name: "Data",
      selector: (row) => row.dateOfIncome,
    },
  ];
    
  return <DataTable columns={columns} data={props.data}
  theme="aqua"
  selectableRows
  noDataComponent="Brak przychodów"
  selectableRowsHighlight
  selectableRowsRadio="radio"
  selectableRowsSingle
  onSelectedRowsChange={props.onSelectedRowsChange}
  clearSelectedRows = {props.clearSelectedRows}
  />;
};
export default IncomesTable
