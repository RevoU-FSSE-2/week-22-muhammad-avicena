import React, { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import kanbanBoard from "../../assets/kanban.avif";
import API_URL from "../../utils/API_URL";
import { UserContext } from "../../hooks/UserContext";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../Logo";
import style from "./loginPage.module.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Muhammad Avicena
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LoginPageComponent() {
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { dispatch } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUsernameError("");
    setPasswordError("");

    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");

    let hasError = false;

    if (!username) {
      setUsernameError("Username is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const loadingAlert = Swal.fire({
      icon: "info",
      title: "Loading",
      text: "Please wait...",
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      sessionStorage.setItem("token", response.data.data.accessToken);
      sessionStorage.setItem("user", JSON.stringify(response.data.data));
      dispatch({ type: "LOGIN", payload: response.data.data });
      loadingAlert.close();

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in. You will be redirected to the dashboard soon...",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } catch (error) {
      loadingAlert.close();
      console.log(error, "isi error");
      Swal.fire({
        icon: "error",
        title: `Login Failed`,
        text: `${error.response.data.message}`,
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100%", width: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${kanbanBoard}), linear-gradient(rgb(20, 13, 27), rgba(0, 0, 0, 1))`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "dark",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Logo className={style.logo} />
            <Typography component="h3" variant="h6">
              Task Management System
            </Typography>
            <br />
            <Typography component="h1" variant="h5">
              Login Panel
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                error={!!usernameError}
                helperText={usernameError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={!!passwordError}
                helperText={passwordError}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item>
                  Don't have an account?{" "}
                  <Link href="/register" variant="body2">
                    {"Register here"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
