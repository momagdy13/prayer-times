import { Container } from "@mui/material";
import "./App.css";
import React from "react";
import MainContent from "./assets/components/MainContent";

function App() {
  return (
    <>
      <div
        style={{ direction: "rtl", display: "flex", justifyContent: "center", width:"100vw"}}
      >
        <Container>
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
