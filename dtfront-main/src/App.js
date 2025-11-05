import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import AppDialog from "AppDialog";

function App() {
  return (
    <>
      <Outlet />
      <AppDialog />
    </>
  );
}

export default App;
