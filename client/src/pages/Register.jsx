import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import authService from "../services/authService";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import "../styles/Login.css";

const theme = createTheme();

function Register() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let nickname = data.get("nickname");
    let email = data.get("email");
    let password = data.get("password");

    if (nickname.length > 10) {
      console.error("nickname length can not be more than 10!");
      return;
    }

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
      .register(nickname, email, password)
      .then(() => {
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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="login__container">
        <Box className="login__box">
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Nickname"
              label="Nickname"
              name="nickname"
              autoComplete="nickname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login__submit-button"
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" className="login__register-link">
                  {"Do have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;
