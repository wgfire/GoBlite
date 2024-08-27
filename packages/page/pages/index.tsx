import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { Preview } from "@platform/components/editor";
import data from "../database1.json";
const theme = createMuiTheme({
  typography: {
    fontFamily: ["acumin-pro", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-full">
        <Preview schema={JSON.stringify(data)} publish={true}></Preview>
      </div>
    </ThemeProvider>
  );
}

export default App;
