import { Route, Routes } from "react-router-dom";
import DepartmentsList from "./DepartmentsList";

import DepartmentPeople from "./DepartmentPeople";


const Department = () => {
  return (
    <Routes>
      <Route path="" element={<DepartmentsList />} />
      <Route
        path=":department_name/:department_id/:department_manager_name"
        element={<DepartmentPeople />}
      />
    </Routes>
  );
};

export default Department;
