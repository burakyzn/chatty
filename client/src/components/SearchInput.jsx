import "../styles/SearchInput.css";
import { useDispatch } from "react-redux";
import { filterUsers } from "../features/sidebarSlice";

export default function SearchInput() {
  const dispatch = useDispatch();

  const handleOnChangeSearchInput = (e) => {
    dispatch(filterUsers(e.target.value));
  };

  return (
    <input
      className="search-input"
      type="text"
      name=""
      id=""
      placeholder="Search"
      onChange={(e) => handleOnChangeSearchInput(e)}
    />
  );
}
