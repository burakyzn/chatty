import "../styles/SearchInput.css";
import { useDispatch } from "react-redux";
import { filterUsers } from "../features/sidebarSlice";
import { FormattedMessage } from "react-intl";

export default function SearchInput() {
  const dispatch = useDispatch();

  const handleOnChangeSearchInput = (e) => {
    dispatch(filterUsers(e.target.value));
  };

  return (
    <FormattedMessage id="search">
      {(msg) => (
        <input
          className="search-input"
          type="text"
          placeholder={msg}
          onChange={(e) => handleOnChangeSearchInput(e)}
        />
      )}
    </FormattedMessage>
  );
}
