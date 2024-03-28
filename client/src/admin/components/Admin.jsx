import { Route, Routes } from "react-router-dom";
import "./Admin.scss";
import Dashboard from "../dashboard/Dashboard";
export const Admin = () => {
  return (
    <>
      <div className="admin">
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
};
