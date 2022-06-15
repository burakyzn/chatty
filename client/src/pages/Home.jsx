import SidebarHeader from "../components/SidebarHeader";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatInputBox from "../components/ChatInputBox";
import ChatArea from "../components/ChatArea";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home__sidebar">
        <SidebarHeader />
        <ChatList />
      </div>
      <div className="home__chat">
        <ChatHeader />
        <ChatArea />
        <ChatInputBox />
      </div>
    </div>
  );
}

export default Home;
