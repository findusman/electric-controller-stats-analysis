import logo from "./logo.svg";
import "./App.css";
import ReactECharts from "echarts-for-react";
import getOptions from "./data/getOptions";
import { useEffect, useState } from "react";

function App() {
  const [option, setOption] = useState({});

  useEffect(() => {
    getOptions().then((result) => setOption(result));
  }, []);

  return (
    <>
      <ReactECharts option={option} />
    </>
  );
}

export default App;
