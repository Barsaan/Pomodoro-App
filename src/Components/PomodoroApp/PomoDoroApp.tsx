import React, { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { FaPause } from "react-icons/fa";
import { FaClock, FaPlay } from "react-icons/fa6";
import { PieChart, Pie, Cell } from "recharts";
import TodoList from "../Todo/TodoList";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoSettingsOutline } from "react-icons/io5";

const PomodoroApp = () => {
  const [activeTab, setActiveTab] = useState("pomodoro");
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  const [pomodoro, setPomodoro] = useState(1500);
  const [shortBreak, setShortBreak] = useState(300);
  const [longBreak, setLongBreak] = useState(900);

  const [showSettings, setShowSettings] = useState(false);
  const [pomodoroInput, setPomodoroInput] = useState(25);
  const [shortBreakInput, setShortBreakInput] = useState(5);
  const [longBreakInput, setLongBreakInput] = useState(15);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      notific();
      resetTimer(activeTab);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  });

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

  const notific = () => {
    if (Notification.permission === "granted") {
      new Notification("Timer ended", {
        body: "You completed a pomodoro",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Timer ended", {
            body: "The time is up",
            tag: "You completed a pomodoro",
          });
        }
      });
    }
  };
  const handleSettingsSave = () => {
    const newPomodoro = pomodoroInput * 60;
    const newShortBreak = shortBreakInput * 60;
    const newLongBreak = longBreakInput * 60;

    setPomodoro(newPomodoro);
    setShortBreak(newShortBreak);
    setLongBreak(newLongBreak);
    localStorage.setItem("pomodoroTime", newPomodoro.toString());
    localStorage.setItem("shortBreakTime", newShortBreak.toString());
    localStorage.setItem("longBreakTime", newLongBreak.toString());

    switch (activeTab) {
      case "pomodoro":
        setSeconds(newPomodoro);
        break;
      case "shortBreak":
        setSeconds(newShortBreak);
        break;
      case "longBreak":
        setSeconds(newLongBreak);
        break;
      default:
        setSeconds(newPomodoro);
    }
    setShowSettings(false);
  };

  useEffect(() => {
    // Load settings from local storage
    const savedPomodoro = localStorage.getItem("pomodoroTime");
    const savedShortBreak = localStorage.getItem("shortBreakTime");
    const savedLongBreak = localStorage.getItem("longBreakTime");

    if (savedPomodoro) {
      setPomodoro(Number(savedPomodoro));
    }
    if (savedShortBreak) {
      setShortBreak(Number(savedShortBreak));
    }
    if (savedLongBreak) {
      setLongBreak(Number(savedLongBreak));
    }

    // Set the initial seconds based on the active tab
    switch (activeTab) {
      case "pomodoro":
        setSeconds(savedPomodoro ? Number(savedPomodoro) : pomodoro);
        break;
      case "shortBreak":
        setSeconds(savedShortBreak ? Number(savedShortBreak) : shortBreak);
        break;
      case "longBreak":
        setSeconds(savedLongBreak ? Number(savedLongBreak) : longBreak);
        break;
      default:
        setSeconds(pomodoro);
    }
  }, [activeTab, longBreak, pomodoro, shortBreak]);
  useEffect(() => {
    const savedPomodoro = localStorage.getItem("pomodoroTime");
    const savedShortBreak = localStorage.getItem("shortBreakTime");
    const savedLongBreak = localStorage.getItem("longBreakTime");

    if (savedPomodoro) {
      setPomodoroInput(Number(savedPomodoro) / 60);
    }
    if (savedShortBreak) {
      setShortBreakInput(Number(savedShortBreak) / 60);
    }
    if (savedLongBreak) {
      setLongBreakInput(Number(savedLongBreak) / 60);
    }
  }, []);

  function handleKeyEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSettingsSave();
    }
  }
  return (
    <div className="pomodoro-app">
      <div className="tab-container">
        <button
          className={activeTab === "pomodoro" ? "active-tab" : "button"}
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
          className={activeTab === "shortBreak" ? "active-tab" : "button"}
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
          className={
            activeTab === "longBreak" ? "active-tab" : "longBreakbutton"
          }
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
        <button
          className="setting-btn "
          type="button"
          onClick={() => setShowSettings(true)}
        >
          <IoSettingsOutline />
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
            <button
              id="pauseBtn"
              className="pause-btn"
              onClick={handleStartPause}
            >
              {isActive ? <FaPause /> : <FaPlay />}
            </button>
            <button className="btn-restart" onClick={handleRestart}>
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

      {showSettings && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <span className="close" onClick={() => setShowSettings(false)}>
                &times;
              </span>
            </div>
            <div className="setting-header-section">
              <h2 className="setting-title">SETTING</h2>
            </div>
            <div className="setting-timer-subtitle">
              <FaClock />
              <p>TIMER</p>
            </div>
            <div className="set-timer-section">
              <div className="set-timer-customize-section">
                <p className="set-timer-title">Pomodoro</p>
                <input
                  min="1"
                  max="999"
                  className="set-timer-inp"
                  value={pomodoroInput}
                  onChange={(event) =>
                    setPomodoroInput(Number(event.target.value))
                  }
                  onKeyDown={(event) => handleKeyEnter(event)}
                  type="number"
                />
              </div>
              <div className="set-timer-customize-section">
                <p className="set-timer-title">Short Break</p>
                <input
                  min={1}
                  max={999}
                  className="set-timer-inp"
                  value={shortBreakInput}
                  onChange={(event) =>
                    setShortBreakInput(Number(event.target.value))
                  }
                  onKeyDown={(event) => handleKeyEnter(event)}
                  type="number"
                />
              </div>
              <div className="set-timer-customize-section">
                <p className="set-timer-title">Long Break</p>
                <input
                  min={1}
                  max={999}
                  className="set-timer-inp"
                  value={longBreakInput}
                  onChange={(event) =>
                    setLongBreakInput(Number(event.target.value))
                  }
                  onKeyDown={(event) => handleKeyEnter(event)}
                  type="number"
                />
              </div>
            </div>
            <button
              className="setting-ok"
              type="button"
              onClick={handleSettingsSave}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroApp;
