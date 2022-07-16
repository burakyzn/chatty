import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as DoneIcon } from "@mui/icons-material/Done";
import "../styles/DrawerInput.css";

export default function DrawerInput(props) {
  const { labelText, value, placeholder, onChange } = props;

  const [changeable, setChangeable] = useState(false);

  const inputStyle = {
    backgroundColor: "#fff",
  };

  const handleBeginTyping = () => {
    setChangeable(true);
  };

  const handleEndTyping = () => {
    setChangeable(false);
  };

  return (
    <div className="drawer-input">
      <div className="drawer-input__label">{labelText}</div>
      <TextField
        hiddenLabel
        value={value}
        onChange={changeable ? onChange : null}
        placeholder={placeholder}
        variant="filled"
        className="drawer-input__input"
        InputProps={{
          style: inputStyle,
          endAdornment: changeable ? (
            <IconButton onClick={handleEndTyping}>
              <DoneIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleBeginTyping}>
              <EditIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
