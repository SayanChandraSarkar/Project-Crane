// import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import Box from "@mui/material/Box";

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";

import "./Layout.scss";

//Import files
import { CraneFirst } from "../pages/Crane-1";
import { CraneSecond } from "../pages/Crane-2";
import { CraneThird } from "../pages/Crane-3";
import PricePage from "../extra/ModelPricesPage";
import UserDetails from "../extra/Information";
import Quotation from "../extra/Quotation";
import { Technical } from "../extra/Technical";
import "../scss/Print.scss";
import { RootPage } from "../extra/RootPage";
import CraneFourth from "../pages/Crane-4";
import { Admin } from "../admin/components/Admin";

export const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <div className="App">
        <div className="w-full">
          {!isAdminRoute ? (
            <div className="output mt-6">
              <Routes>
                <Route path="/" element={<RootPage />} />
                <Route
                  path="/Wagon against 2 shock absorbers"
                  element={<CraneFirst />}
                />
                <Route path="/Wagon against Wagon" element={<CraneSecond />} />
                <Route
                  path="/Wagon against Wagon 2 shock absorber"
                  element={<CraneThird />}
                />
                <Route
                  path="/Wagon against 1 shock absorbers"
                  element={<CraneFourth />}
                />
                <Route path="/price/:modelName" element={<PricePage />} />
                <Route
                  path="/price/:modelName/info"
                  element={<UserDetails />}
                />
                <Route
                  path="/price/:modelName/info/:userId/technical/quotation"
                  element={<Quotation />}
                />
                <Route
                  path="/price/:modelName/info/:userId/technical"
                  element={<Technical />}
                />
              </Routes>
            </div>
          ) : (
            <div className="auth">
              <Admin />
            </div>
          )}
        </div>
      </div>
      <style>{`
      @media print {
          body {
            margin: 0;
          }
          .menu-bar,
          .drawer {
              display: none !important;}
        
        .drawer.hidden-for-print {
          display: none !important;
        }
        .navbar{
          display: none !important
        }

        .output{
          box-shadow:none;
        }
      }
      `}</style>
    </>
  );
};
