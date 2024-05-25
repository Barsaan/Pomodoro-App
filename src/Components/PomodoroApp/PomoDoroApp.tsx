import React, { useState, useEffect } from "react";
import { VscDebugStart, VscDebugRestart } from "react-icons/vsc";
import { FaRegCirclePause } from "react-icons/fa6";
import { PieChart, Pie, Cell } from "recharts";
import TodoList from "../Todo/TodoList";
import { Tooltip as ReactTooltip, Tooltip } from "react-tooltip";

const PomodoroApp = () => {
  const [activeTab, setActiveTab] = useState("pomodoro");
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  const pomodoro = 1500;
  const shortBreak = 300;
  const longBreak = 900;

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      resetTimer(activeTab);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, activeTab]);

  useEffect(() => {
    const formattedTime = formatTime(seconds);

    switch (activeTab) {
      case "pomodoro":
        document.title = `${formattedTime} - Time to focus!`;
        break;
      case "shortBreak":
      case "longBreak":
        document.title = `${formattedTime} - Time for a break!`;
        break;
      default:
        document.title = `${formattedTime} - Pomodoro Timer`;
    }
  }, [seconds, activeTab]);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
    resetTimer(tab);
  };

  const resetTimer = (tab: React.SetStateAction<string>) => {
    setIsActive(false);
    switch (tab) {
      case "pomodoro":
        setSeconds(pomodoro);
        break;
      case "shortBreak":
        setSeconds(shortBreak);
        break;
      case "longBreak":
        setSeconds(longBreak);
        break;
      default:
        setSeconds(pomodoro);
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleRestart = () => {
    resetTimer(activeTab);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalRemainingTime = () => {
    switch (activeTab) {
      case "pomodoro":
        return pomodoro;
      case "shortBreak":
        return shortBreak;
      case "longBreak":
        return longBreak;
      default:
        return 0;
    }
  };

  return (
    <div className="pomodoro-app">
      <div className="tab-container">
        <button
          className={activeTab === "pomodoro" ? "active-tab" : ""}
          onClick={() => handleTabClick("pomodoro")}
          data-tooltip-id={
            isActive && activeTab !== "pomodoro" ? "my-tooltip" : ""
          }
          data-tooltip-content={
            isActive && activeTab !== "pomodoro"
              ? "Existing time will be stopped"
              : ""
          }
        >
          Pomodoro
        </button>
        <button
          className={activeTab === "shortBreak" ? "active-tab" : ""}
          onClick={() => handleTabClick("shortBreak")}
          data-tooltip-id={
            isActive && activeTab !== "shortBreak" ? "my-tooltip" : ""
          }
          data-tooltip-content={
            isActive && activeTab !== "shortBreak"
              ? "Existing time will be stopped"
              : ""
          }
        >
          Short Break
        </button>
        <button
          className={activeTab === "longBreak" ? "active-tab" : ""}
          onClick={() => handleTabClick("longBreak")}
          data-tooltip-id={
            isActive && activeTab !== "longBreak" ? "my-tooltip" : ""
          }
          data-tooltip-content={
            isActive && activeTab !== "longBreak"
              ? "Existing time will be stopped"
              : ""
          }
        >
          Long Break
        </button>
      </div>

      <div className="pie-chart-container">
        <PieChart width={300} height={300}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F86FF" stopOpacity={1} />
              <stop offset="100%" stopColor="#FF7586" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Pie
            animationBegin={0}
            animationDuration={0}
            stroke=""
            startAngle={90}
            endAngle={-270}
            data={[
              {
                value: seconds,
                key: "timeRemaining",
                color: "yellow",
              },
              {
                value: totalRemainingTime() - seconds,
                key: "timeElapsed",
                color: "red",
              },
            ]}
            dataKey="value"
            nameKey="key"
            cx="50%"
            cy="50%"
            innerRadius={120}
            outerRadius={126}
          >
            <Cell key="timeRemaining" fill="url(#colorUv)" />
            <Cell key="timeElapsed" fill="#2C2D36" />
          </Pie>
        </PieChart>
        <div className="timer-text">
          {formatTime(seconds)}
          <div className="control-btn">
            <button onClick={handleStartPause}>
              {isActive ? <FaRegCirclePause /> : <VscDebugStart />}
            </button>
            <button onClick={handleRestart}>
              <VscDebugRestart />
            </button>
          </div>
          {isActive && (
            <ReactTooltip place="bottom" id="my-tooltip">
              Existing time will be stopped
            </ReactTooltip>
          )}
        </div>
      </div>
      <TodoList />
    </div>
  );
};

export default PomodoroApp;
