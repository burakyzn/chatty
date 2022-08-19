import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../styles/DrawerItem.css";
import "../styles/DrawerSelect.css";

export default function DrawerSelect(props) {
  const { label, value, onChange, children } = props;

  const menuPropStyle = {
    zIndex: "99999",
  };

  return (
    <div className="drawer-item">
      <div className="drawer-item__label">{label}</div>
      <FormControl variant="standard" className="drawer-item__input">
        <Select
          value={value}
          onChange={onChange}
          hiddenLabel
          MenuProps={{
            style: menuPropStyle,
          }}
          className="drawer-select__dropdown"
        >
          {children}
        </Select>
      </FormControl>
    </div>
  );
}
