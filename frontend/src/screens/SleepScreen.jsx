import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPencil } from "react-icons/bs";
import "./sleepScreen.scss";

const SleepScreen = () => {
  const [bedtime, setBedtime] = useState("00:00");
  const [alarm, setAlarm] = useState("08:00");
  const [editBed, setEditBed] = useState(false);
  const [editAlarm, setEditAlarm] = useState(false);

  const navigate = useNavigate(); 

  const radius = 100;
  const center = 110;
  const circumference = 2 * Math.PI * radius;

  const [bedHours, bedMinutes] = bedtime.split(":").map(Number);
  const [alarmHours, alarmMinutes] = alarm.split(":").map(Number);

  const bedMins = bedHours * 60 + bedMinutes;
  const alarmMins = alarmHours * 60 + alarmMinutes;
  const totalMins =
    alarmMins >= bedMins ? alarmMins - bedMins : 1440 - bedMins + alarmMins;

  const progress = totalMins / 1440;
  const dashOffset = circumference * (1 - progress);
  const startAngle = (bedMins / 1440) * 360;

  const polarToCartesian = (angleDeg) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(rad);
    const y = center + radius * Math.sin(rad);
    return { x, y };
  };

  const moonPos = polarToCartesian(startAngle);

  return (
    <div className="sleep-screen">
      <h1 className="title">Sleep tracker</h1>

      <div className="circular-chart">
        <div className="svg-wrapper">
          <svg width="100%" height="100%" viewBox="0 0 220 220">
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#FBD115"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#5F6C92"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(${startAngle - 90} ${center} ${center})`}
              style={{
                transition: "stroke-dashoffset 0.5s ease, transform 0.5s ease",
              }}
            />
            <text x="110" y="40" textAnchor="middle" fontSize="12" fill="white">
              12AM
            </text>
            <text x="185" y="114" textAnchor="middle" fontSize="12" fill="white">
              6AM
            </text>
            <text x="110" y="195" textAnchor="middle" fontSize="12" fill="white">
              12PM
            </text>
            <text x="35" y="114" textAnchor="middle" fontSize="12" fill="white">
              6PM
            </text>
          </svg>
        </div>
      </div>

      <div className="time-settings">
        <div className="setting-row">
          <span>Bedtime</span>
          {editBed ? (
            <input
              type="time"
              value={bedtime}
              className="time-input"
              onChange={(e) => setBedtime(e.target.value)}
              onBlur={() => setEditBed(false)}
            />
          ) : (
            <>
              <span className="time">{bedtime}</span>
              <BsPencil className="edit-icon" onClick={() => setEditBed(true)} />
            </>
          )}
        </div>

        <div className="setting-row">
          <span>Alarm</span>
          {editAlarm ? (
            <input
              type="time"
              value={alarm}
              className="time-input"
              onChange={(e) => setAlarm(e.target.value)}
              onBlur={() => setEditAlarm(false)}
            />
          ) : (
            <>
              <span className="time">{alarm}</span>
              <BsPencil className="edit-icon" onClick={() => setEditAlarm(true)} />
            </>
          )}
        </div>
      </div>

      {/* ✅ Button navigates to Alarm screen */}
      <button className="sleep-btn" onClick={() => navigate("/alarm")}>
        Sleep Now
      </button>
    </div>
  );
};

export default SleepScreen;
