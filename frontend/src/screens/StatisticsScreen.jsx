import React, { useEffect, useRef, useState } from "react";
import "./statisticsScreen.scss";
import SleepStagesChart from "../components/sleepstageschart";

import CoffeeIcon from "../assets/Icons/CoffeeIcon";
import EarplugIcon from "../assets/Icons/EarplugIcon";
import ExerciseIcon from "../assets/Icons/ExcerciseIcon"; 
import JournalIcon from "../assets/Icons/JournalIcon";
import MusicIcon from "../assets/Icons/MusicIcon";
import NapIcon from "../assets/Icons/NapIcon";
import PajamasIcon from "../assets/Icons/PajamasIcon";
import ScreenIcon from "../assets/Icons/ScreenIcon";
import StretchIcon from "../assets/Icons/StretchIcon";
import TemperatureIcon from "../assets/Icons/TemperatureIcon";
import WaterIcon from "../assets/Icons/WaterIcon";
import DeclutterIcon from "../assets/Icons/DeclutterIcon";

const getLastNDays = (days = 14) => {
  const today = new Date();
  const pastDays = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    pastDays.push({
      key: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    });
  }
  return pastDays;
};

const generateFakeData = (dateKey) => {
  const seed = dateKey.split("-").reduce((sum, val) => sum + parseInt(val), 0);
  const asleepHours = 6 + (seed % 4);
  const deep = +(Math.random() * (asleepHours / 2)).toFixed(1);
  const remaining = asleepHours - deep;
  const light = +(Math.random() * remaining).toFixed(1);
  const deepPct = +((deep / asleepHours) * 100).toFixed(1);
  const lightPct = +((light / asleepHours) * 100).toFixed(1);
  const awakePct = +(100 - deepPct - lightPct).toFixed(1);
  return {
    asleep: `${asleepHours}h`,
    inBed: `${asleepHours + 1}h ${30 + (seed % 30)}min`,
    noise: `${30 + (seed % 20)}dB`,
    sleepStages: { deep: deepPct, light: lightPct, awake: awakePct },
  };
};

const allTips = [
  { icon: "earplug", text: "Use ear plugs in not so quiet places for better rest." },
  { icon: "water", text: "Stay hydrated! Drinking water before bed supports temperature regulation." },
  { icon: "screen", text: "Avoid screens 1–2 hours before bed." },
  { icon: "music", text: "Listen to peaceful sounds before going to sleep. It’ll help you to reduce stress." },
  { icon: "coffee", text: "Avoid caffeine late, don’t drink coffee or energy drinks after 2–3 PM." },
  { icon: "exercise", text: "Be active, regular exercise during the day helps you sleep better at night." },
  { icon: "nap", text: "Limit naps, keep naps short." },
  { icon: "temperature", text: "Keep your bedroom cool, aim for a room temperature between 16–19°C." },
  { icon: "pajamas", text: "Wear comfy pajamas, soft, breathable clothes help you relax." },
  { icon: "declutter", text: "Declutter your room, tidy space can make you feel more relaxed." },
  { icon: "stretch", text: "Stretch gently, light stretches help your body." },
  { icon: "journal", text: "Journal before bed, clear your mind by writing down thoughts." },
];

const StatisticsScreen = () => {
  const scrollRef = useRef(null);
  const weekDates = getLastNDays();
  const [selectedDate, setSelectedDate] = useState(
    weekDates.find((d) => d.isToday).key
  );

  const selectedData = generateFakeData(selectedDate);

  useEffect(() => {
    const todayIndex = weekDates.findIndex((d) => d.isToday);
    if (scrollRef.current) {
      const child = scrollRef.current.children[todayIndex];
      if (child) child.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [weekDates]);

  const [randomTips, setRandomTips] = useState([]);
  useEffect(() => {
    const shuffled = [...allTips].sort(() => 0.5 - Math.random());
    setRandomTips(shuffled.slice(0, 4));
  }, [selectedDate]);

  return (
    <div className="statistics-screen">
      <h1 className="title">Statistics</h1>

      <div className="date-row-wrapper">
        <div className="date-row" ref={scrollRef}>
          {weekDates.map((d, i) => (
            <div
              key={i}
              className={`date-item ${selectedDate === d.key ? "active" : ""}`}
              onClick={() => setSelectedDate(d.key)}
            >
              <span className="day">{d.day}</span>
              <span className="date">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-title">Sleep stages</h2>
      <SleepStagesChart
        stages={selectedData.sleepStages}
        asleepHours={parseInt(selectedData.asleep)}
      />

      <div className="sleep-info">
        <div className="info-block">
          <div className="label">Asleep</div>
          <div className="value">{selectedData.asleep}</div>
        </div>
        <div className="info-block">
          <div className="label">In bed</div>
          <div className="value">{selectedData.inBed}</div>
        </div>
        <div className="info-block">
          <div className="label">Noise</div>
          <div className="value">{selectedData.noise}</div>
        </div>
      </div>

      <h2 className="section-title">Tips</h2>
      <div className="tips">
        {randomTips.map((tip, index) => (
          <div className="tip" key={index}>
            <span>
              {tip.icon === "earplug" && <EarplugIcon />}
              {tip.icon === "water" && <WaterIcon />}
              {tip.icon === "screen" && <ScreenIcon />}
              {tip.icon === "music" && <MusicIcon />}
              {tip.icon === "coffee" && <CoffeeIcon />}
              {tip.icon === "exercise" && <ExerciseIcon />}
              {tip.icon === "nap" && <NapIcon />}
              {tip.icon === "temperature" && <TemperatureIcon />}
              {tip.icon === "pajamas" && <PajamasIcon />}
              {tip.icon === "declutter" && <DeclutterIcon />}
              {tip.icon === "stretch" && <StretchIcon />}
              {tip.icon === "journal" && <JournalIcon />}
            </span>
            {tip.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsScreen;
