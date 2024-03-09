import { Flex } from "@mantine/core";
import { useState } from "react";
import DepartmentPeople from "./DepartmentPeople";


const SingleDepartmentPage = () => {
  const [page, setPage] = useState(1);

  return (
    <>
      <div className="mb-20">
        <header className="flex bg-white p-4 ">
          <Flex
            className="border items-center py-3 px-7 rounded-xl shadow-sm text-slate-600"
            gap="xl"
          >
            <div
              onClick={() => setPage(1)}
              className="hover:text-indigo-400 cursor-pointer"
            >
              Users
            </div>
            <div
              onClick={() => setPage(2)}
              className="hover:text-indigo-400  cursor-pointer"
            >
              Skills
            </div>
            <div
              onClick={() => setPage(3)}
              className="hover:text-indigo-400  cursor-pointer"
            >
              Projects
            </div>
          </Flex>
        </header>
        <Flex className="justify-center ">
          <Flex
            direction="column"
            className="md:w-3/5 w-full align-center justify-center mb-20 mt-10"
          >
            {page === 1 && (
              <DepartmentPeople
                department_id=""
                department_manager_name=""
                department_name=""
              />
            )}
           
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default SingleDepartmentPage;
