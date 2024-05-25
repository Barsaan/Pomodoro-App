import "./Pomo.scss";
import PomodoroApp from "./Components/PomodoroApp/PomoDoroApp";
import { useEffect } from "react";
import "react-tooltip/dist/react-tooltip.css";

const App = () => {
  useEffect(() => {
    document.title = " 25:00 - Time to focus!";
  });
  return (
    <div className="App">
      <PomodoroApp />
    </div>
  );
};
export default App;
  