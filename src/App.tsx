import { useEffect } from "react";
import "./App.css";

function App() {
  const getData = async () => {
    const response = await fetch("http://localhost:5000/filter");
    const data = await response.json();

    console.log(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return <>Hola</>;
}

export default App;
