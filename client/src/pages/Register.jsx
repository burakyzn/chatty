import { useState } from "react";
import authService from "../services/authService";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleRegisterButton = async () => {
    if (email.length === 0) {
      console.error("email can not be empty!");
      return;
    }

    if (nickname.length === 0) {
      console.error("nickname can not be empty!");
      return;
    }

    if (nickname.length > 10) {
      console.error("nickname length can not be more than ten!");
      return;
    }

    setLoader(true);
    authService
      .register(nickname, email, password)
      .then((result) => {
        navigate("/login");
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
        <label htmlFor="nickname">Nickname : </label>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email : </label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password : </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleRegisterButton}>Register</button>
      </div>
    </div>
  );
}

export default Register;
