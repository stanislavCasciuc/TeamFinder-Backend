import { Accordion, Flex, LoadingOverlay, Pagination } from "@mantine/core";
import FocusTrapComponent from "./FocusTrapComponent";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useSWR from "swr";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IconXboxX } from "@tabler/icons-react";
import { GETALLUSERS } from "../EndPoints";
import { useState } from "react";

interface UserData {
  name: string;
  department_name: string;
  roles: string[];
  id: number;
}
interface AccordionComponentProps {
  menuSelection: string;
}

export default function AccordionComponent({
  menuSelection,
}: AccordionComponentProps) {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get("user_id");
  const selectedUserId = user_id ? parseInt(user_id) : 0;
  let allRoles: string[] = [];
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 7;

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    GETALLUSERS,
    (url) => {
      console.log("Fetching data from:", url);

      return axios
        .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => response.data);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const data = responseData || [];

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }
  if (error) {
    return <span className="errmsg">Error getting the list of users</span>;
  }

  const UserRoles = data.find((user: UserData) => user.id === selectedUserId)
    ?.roles || [""];
  if (selectedUserId !== 0) allRoles = UserRoles;

  const filteredUsersAccordion =
    menuSelection === "All Users"
      ? data.map((item: UserData) => item)
      : data.filter((item: UserData) => item.roles.includes(menuSelection));

  const indexOfLastSkill = currentPage * elementsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - elementsPerPage;
  const currentUsers = filteredUsersAccordion.slice(
    indexOfFirstSkill,
    indexOfLastSkill
  );

  let pageNumbers = 1;
  for (
    let i = 0;
    i < Math.ceil(filteredUsersAccordion.length / elementsPerPage);
    i++
  ) {
    pageNumbers = pageNumbers + i;
  }

  const users = currentUsers
    .sort((a: UserData, b: UserData) => a.name.localeCompare(b.name))
    .map((item: UserData, index: number) => (
      <Accordion.Item
        className="align-center"
        key={item.id}
        value={`${item.name}-${index}`}
      >
        <Accordion.Control
          className="p-2"
          onClick={() => {
            navigate(`/Homepage/Users?user_id=${item.id}`);
          }}
          icon={
            <Flex className="w-10 h-10 text-indigo-600 bg-indigo-50 items-center align-center justify-center rounded-full">
              <span className="text-md font-bold">
                {item.name.substring(0, 1).toUpperCase()}
              </span>
            </Flex>
          }
        >
          <span className="font-semibold text-slate-600">{item.name}</span>
        </Accordion.Control>

        <Accordion.Panel>
          <span
            onClick={() => {
              navigate(`/Homepage/Profile?user_id=${item.id}`);
            }}
            className="text-indigo-300 text-sm hover:text-indigo-400 cursor-pointer"
          >
            View Profile
          </span>
        </Accordion.Panel>

        <Accordion.Panel className="border-t bg-white pt-2 ">
          <div>
            <span className="font-semibold text-md">Department: </span>
            {item.department_name ? item.department_name : "Not Assigned Yet"}
          </div>
        </Accordion.Panel>

        <Accordion.Panel className=" bg-white">
          <Flex direction="row" className="mt-2 gap-4  flex-wrap" key={item.id}>
            <span className="font-semibold text-md mt-2">Roles: </span>
            {item.roles.map((role: string) => (
              <>
                <Flex
                  className=" flex border rounded-xl p-2 justify-between"
                  key={index}
                >
                  <span className="font-base text-sm">{role}</span>
                  {role !== "Employee" && (
                    <IconXboxX
                      key={`delete-${role}`}
                      onClick={() => {
                        const updatedRoles = allRoles.filter(
                          (item) => item !== role
                        );
                        axios
                          .put(
                            `http://atc-2024-quantumtrio-be-linux-web-app.azurewebsites.net/api/users/roles/update?user_id=${selectedUserId}`,
                            updatedRoles,

                            {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                              },
                            }
                          )
                          .then(() => {
                            mutate(GETALLUSERS);
                          })
                          .catch(() => {
                            alert(
                              "You can't delete the Organization Admin role"
                            );
                          });
                      }}
                      className="ml-2  cursor-pointer hover:bg-slate-200 rounded-full "
                      size={20}
                    />
                  )}
                </Flex>
              </>
            ))}

            {selectedUserId !== 0 && allRoles.length < 4 && (
              <FocusTrapComponent
                allRoles={allRoles}
                selectedUserId={selectedUserId}
              />
            )}

            {selectedUserId !== 0 && allRoles.length === 4 && (
              <span className="text-red-300 text-xs mt-3">
                You can't add more than 4 roles to a user
              </span>
            )}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    ));

  return (
    <Accordion className=" rounded-xl" defaultValue={"0"}>
      {users}{" "}
      <Pagination
        className="mt-4 text-slate-500"
        total={pageNumbers}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </Accordion>
  );
}
