import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { SettingContextProvider } from "./context/Setting.context";
import "./App.scss";
import SettingPanel from "./shared/components/SettingPanel";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <SettingContextProvider>
      <div className="kalendar-container">
        <nav className="kalendar-nav">
          <div className="kalendar-breadcumb">
            <Link
              className={`kalendar-breadcumb-item ${
                location.pathname === "/"
                  ? "kalendar-breadcumb-item__active"
                  : ""
              }`}
              to="/"
            >
              <span className="kalendar-breadcumb-item-icon">🗓</span>
              <span className="kalendar-breadcumb-item-text">Calendar</span>
            </Link>
            &nbsp;&gt;&nbsp;
            <Link
              className={`kalendar-breadcumb-item ${
                location.pathname === "/scheduling"
                  ? "kalendar-breadcumb-item__active"
                  : ""
              }`}
              to="/scheduling"
            >
              <span className="kalendar-breadcumb-item-icon">📟</span>
              <span className="kalendar-breadcumb-item-text">Scheduling</span>
            </Link>
          </div>
          <SettingPanel />
        </nav>

        <Outlet />
      </div>
    </SettingContextProvider>
  );
};

export default Layout;
