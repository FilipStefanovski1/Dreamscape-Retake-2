import React, { useEffect, useState } from 'react';
import ToggleSwitch from '../components/toggleSwitch';
import './profileScreen.scss';

const ChallengeCircle = ({ percentage, label }) => {
  const [dashOffset, setDashOffset] = useState(175.84);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDashOffset(175.84 * (1 - percentage / 100));
    }, 100);
    return () => clearTimeout(timeout);
  }, [percentage]);

  return (
    <div className="challenge">
      <div className="progress-circle">
        <svg>
          <circle cx="32" cy="32" r="28" stroke="#C1C1C1" strokeWidth="8" fill="none" />
          <circle
            className="animated-ring"
            cx="32"
            cy="32"
            r="28"
            stroke="#FBD115"
            strokeWidth="8"
            fill="none"
            strokeDasharray="175.84"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="percentage">{percentage}%</div>
      </div>
      <p>{label}</p>
    </div>
  );
};

const ProfileScreen = () => {
  return (
    <div className="profile-page">
      <div className="content">
        
        {/* Profile header */}
        <div className="profile-header">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User avatar"
          />
          <h2>Welcome!</h2>
        </div>

        {/* Challenges */}
        <div className="challenges">
          <h3>Your challenges</h3>
          <div className="challenge-box">
            <ChallengeCircle percentage={50} label="You listened calming sounds 5/10 days in a row" />
            <ChallengeCircle percentage={90} label="You tracked your sleep 9/10 days in a row" />
          </div>
        </div>

        {/* Settings */}
        <div className="settings">
          <h3>Settings</h3>
          <div className="settings-box">
            <div className="section">General settings</div>
            <div className="row">Language</div>
            <div className="row">
              <span>Apple Health</span>
              <ToggleSwitch />
            </div>
            <div className="logout">Log out</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;
