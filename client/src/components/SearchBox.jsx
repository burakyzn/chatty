import { default as SearchIcon } from "@mui/icons-material/Search";
import SearchInput from "./SearchInput";
import "../styles/SearchBox.css";

export default function SearchBox() {
  return (
    <div className="search-box">
      <SearchIcon />
      <SearchInput />
    </div>
  );
}
