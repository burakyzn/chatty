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
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import "../styles/Login.css";

const theme = createTheme();

function Login() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let email = data.get("email");
    let password = data.get("password");

    if (email.length === 0) {
      toast.error(<FormattedMessage id="emptyEmail" />);
      return;
    }

    if (password.length === 0) {
      toast.error(<FormattedMessage id="emptyPassword" />);
      return;
    }

    setLoader(true);
    authService
      .login(email, password)
      .then((result) => {
        localStorage.setItem("token", result.token);
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error.message);
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
            <FormattedMessage id="signIn" />
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={<FormattedMessage id="email" />}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={<FormattedMessage id="password" />}
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
              <FormattedMessage id="signIn" />
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" className="login__register-link">
                  <FormattedMessage id="recommendSignUp" />
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
