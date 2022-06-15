import React from "react";

function Register() {
  return (
    <div>
      <div>
        <label htmlFor="email">Email : </label>
        <input type="text" name="email" />
      </div>
      <div>
        <label htmlFor="email">First Name : </label>
        <input type="text" name="firstName" />
      </div>
      <div>
        <label htmlFor="email">Last Name : </label>
        <input type="text" name="lastName" />
      </div>
      <div>
        <label htmlFor="password">Password : </label>
        <input type="password" name="password" />
      </div>
      <div>
        <button>Register</button>
      </div>
    </div>
  );
}

export default Register;
