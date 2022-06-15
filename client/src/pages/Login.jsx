import React from "react";

function Login() {
  return (
    <div>
      <div>
        <label htmlFor="email">Email : </label>
        <input type="text" name="email" />
      </div>
      <div>
        <label htmlFor="password">Password : </label>
        <input type="password" name="password" />
      </div>
      <div>
        <button>Login</button>
      </div>
    </div>
  );
}

export default Login;
