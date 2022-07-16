import DataTable from "react-data-table-component";
import theme from "./dataTableTheme";


const GroupsTable = (props) => {
    theme()

    
  const columns = [
    {
      name: "Nazwa",
      selector: (row) => row.groupName,
    },
    {
      name: "Wysokość składki",
      selector: (row) => row.monthlySubscription.value,
    }
  ];
    
  return <DataTable columns={columns} data={props.data}
  theme="aqua"
  selectableRows
  noDataComponent="Brak grup treningowych"
  selectableRowsHighlight
  selectableRowsRadio="radio"
  selectableRowsSingle
  onSelectedRowsChange={props.onSelectedRowsChange}
  clearSelectedRows = {props.clearSelectedRows}
  />;
};
export default GroupsTable
