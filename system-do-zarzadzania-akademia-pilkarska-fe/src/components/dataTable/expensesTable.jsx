import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";


const ExpensesTable = (props) => {
    theme()

    
  const columns = [
    {
      name: "Tytuł",
      selector: (row) => row.expenseTitle,
    },
    {
      name: "Wartość (w zł)",
      selector: (row) => row.expenseValue,
    },
    {
      name: "Data",
      selector: (row) => row.dateOfExpense,
    },
  ];
    
  return <DataTable columns={columns} data={props.data}
  theme="aqua"
  selectableRows
  noDataComponent="Brak wydatków"
  selectableRowsHighlight
  selectableRowsRadio="radio"
  selectableRowsSingle
  onSelectedRowsChange={props.onSelectedRowsChange}
  clearSelectedRows = {props.clearSelectedRows}
  />;
};
export default ExpensesTable
