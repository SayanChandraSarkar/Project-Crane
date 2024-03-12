import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Icon } from "@iconify/react";
import "./Layout.scss";

//Import files
import { CraneFirst } from "../pages/Crane-1";
import { CraneSecond } from "../pages/Crane-2";
import { CraneThird } from "../pages/Crane-3";
import PricePage from "../extra/ModelPricesPage";
import { useNavigate } from "react-router-dom";
import UserDetails from "../extra/Information";
import Quotation from "../extra/Quotation";

export const Layout = () => {
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    "Wagon against 2 shock absorbers"
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 1240) {
        setOpenDrawer(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handleItemClick = (url) => {
    setSelectedItem(url);
    setOpenDrawer(false);
    navigate(url);
    // navigate('/hello');
  };

  const menuItems = ["Crane First", "Crane Second", "Crane Third"];

  //Drawer List
  const DrawerList = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
      <div className="logo">
        <img src="/images/logo.png" alt="Logo" />
      </div>
      <List>
        {[
          { path: "/", label: "Wagon against 2 shock absorbers" },
          { path: "/crane-2", label: "Wagon against Wagon" },
          { path: "/crane-3", label: "Wagon against Wagon 2 shock absorber" },
        ].map((t) => (
          <ListItem
            key={t.path}
            disablePadding
            className="listItem"
            onClick={() => handleItemClick(t.path)}
          >
            <ListItemButton>
              <ListItemText primary={t.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <div className="App">
        <div className="navbar">
          <div className="logo">
            <img src="/images/logo.png" alt="Logo" />
          </div>
          <ul>
            {menuItems.map((text) => (
              <li
                key={text}
                onClick={() => handleItemClick(text)}
                className={selectedItem === text ? "active" : ""}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {windowWidth <= 1240 && (
            <Button
              sx={{
                fontSize: "2.2rem",
                color: "#333",
                padding: "16px 16px 10px 16px",
              }}
              onClick={toggleDrawer(true)}
            >
              <Icon icon="heroicons-solid:menu-alt-2" />
            </Button>
          )}
          <Drawer
            open={openDrawer && windowWidth < 1240}
            onClose={toggleDrawer(false)}
          >
            {DrawerList}
          </Drawer>
          <div className="output">
            <Routes>
              <Route path="/" element={<CraneFirst />} />
              <Route path="/crane-2" element={<CraneSecond />} />
              <Route path="/crane-3" element={<CraneThird />} />
              <Route path="/price/:modelName" element={<PricePage />} />
              <Route path="/price/:modelName/info" element={<UserDetails />} />
              <Route
                path="/price/:modelName/info/quotation/:userId"
                element={<Quotation />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
