import { useState } from "react";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { changeNickname } from "../features/chatSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleLoginClick = () => {
    if (email.length === 0) {
      console.error("email can not be empty!");
      return;
    }

    if (password.length === 0) {
      console.error("password can not be empty!");
      return;
    }

    setLoader(true);
    authService
      .login(email, password)
      .then((result) => {
        localStorage.setItem("token", result.token);
        navigate("/chat");
      })
      .catch((error) => {
        console.error(error.code, error.message);
        setLoader(false);
      });
  };

  return loader ? (
    <Loader open={loader} />
  ) : (
    <div>
      <div>
        <label htmlFor="email">Email : </label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
      </div>
      <div>
        <label htmlFor="password">Password : </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
      </div>
      <div>
        <button onClick={handleLoginClick}>Login</button>
      </div>
    </div>
  );
}

export default Login;
