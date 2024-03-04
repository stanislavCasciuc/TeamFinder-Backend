import { Flex } from "@mantine/core";
import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import AccordionComponent from "./AccordionComponent";

const Users = () => {
  const [menuSelection, setMenuSelection] = useState("All Users");

  return (
    <div className="w-full">
      <Flex
        direction="column"
        className="w-full text-left md:px-24 md:py-12  text-slate-900  px-12 py-6  gap-10 box-shadow"
      >
        <DropdownMenu
          selection={menuSelection}
          setSelection={setMenuSelection}
        />
        <AccordionComponent menuSelection={menuSelection} />
      </Flex>
    </div>
  );
};

export default Users;
