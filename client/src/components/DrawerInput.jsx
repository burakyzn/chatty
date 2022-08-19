import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as DoneIcon } from "@mui/icons-material/Done";
import "../styles/DrawerItem.css";

export default function DrawerInput(props) {
  const { editable, labelText, value, placeholder, onChange, onSave } = props;

  const [changeable, setChangeable] = useState(false);

  const inputStyle = {
    backgroundColor: "#fff",
  };

  const handleBeginTyping = () => {
    setChangeable(true);
  };

  const handleEndTyping = () => {
    setChangeable(false);
    if (onSave) onSave();
  };

  return (
    <div className="drawer-item">
      <div className="drawer-item__label">{labelText}</div>
      <TextField
        hiddenLabel
        value={value}
        onChange={changeable ? onChange : null}
        placeholder={placeholder}
        variant="filled"
        className="drawer-item__input"
        InputProps={{
          style: inputStyle,
          endAdornment: editable ? (
            changeable ? (
              <IconButton onClick={handleEndTyping}>
                <DoneIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleBeginTyping}>
                <EditIcon />
              </IconButton>
            )
          ) : null,
        }}
      />
    </div>
  );
}
