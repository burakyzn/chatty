import SearchBox from "./SearchBox";
import MenuButton from "./MenuButton";
import "../styles/SidebarHeader.css";

export default function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <MenuButton />
      <SearchBox />
    </div>
  );
}
