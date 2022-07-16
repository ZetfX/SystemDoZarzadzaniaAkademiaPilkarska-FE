import { createTheme } from "react-data-table-component";
export default function theme() {
  createTheme(
    "aqua",
    {
      text: {
        primary: "#000",
        secondary: "#000",
      },
      background: {
        default: "#03dac5",
      }
    },
    "dark"
  );
}
