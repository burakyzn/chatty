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

function Register() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let nickname = data.get("nickname");
    let email = data.get("email");
    let password = data.get("password");

    if (nickname.length === 0) {
      toast.error(<FormattedMessage id="emptyNickname" />);
      return;
    }

    if (nickname.length > 10) {
      toast.error(<FormattedMessage id="nicknameLengthError" />);
      return;
    }

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
      .register(nickname, email, password)
      .then(() => {
        toast.success(<FormattedMessage id="successfullySignUp" />);
        navigate("/login");
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
            <FormattedMessage id="signUp" />
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Nickname"
              label={<FormattedMessage id="nickname" />}
              name="nickname"
              autoComplete="nickname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={<FormattedMessage id="email" />}
              name="email"
              autoComplete="email"
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
              {<FormattedMessage id="signUp" />}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" className="login__register-link">
                  <FormattedMessage id="recommendSignIn" />
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
