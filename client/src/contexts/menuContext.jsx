import { createContext, useState } from "react";

export const MenuContext = createContext();

function MenuProvider(props) {
  const [openSetting, setOpenSetting] = useState(false);
  const [openCreateRoom, setOpenCreateRoom] = useState(false);

  return (
    <MenuContext.Provider
      value={{ openSetting, setOpenSetting, openCreateRoom, setOpenCreateRoom }}
    >
      {props.children}
    </MenuContext.Provider>
  );
}

export default MenuProvider;
