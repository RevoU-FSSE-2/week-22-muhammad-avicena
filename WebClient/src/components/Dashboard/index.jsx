import React, { useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import WeatherIcon from "@mui/icons-material/WbSunny";
import CalendarIcon from "@mui/icons-material/EventNote";
import Badge from "@mui/material/Badge";
import { format } from "date-fns";
import API_URL from "../../utils/API_URL";

import WeatherPic from "../../assets/weather.jpg";
import KanbanPic from "../../assets/people-working.avif";
import CalendarPic from "../../assets/calendar.avif";

const cardMediaStyle = {
  height: 160,
  objectPosition: "center 40%",
};

const DashboardCard = () => {
  const currentDate = new Date();
  // const { state } = useContext(UserContext);
  // const user = state.user;
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "auto 1fr",
        gap: 16,
      }}
    >
      <Card
        style={{ gridRow: "1 / 2", gridColumn: "1 / 4" }}
        variant="outlined"
        elevation={0}
      >
        <CardContent>
          {user ? (
            <>
              <Typography
                variant="h5"
                color="primary"
                align="center"
                gutterBottom
              >
                Welcome, <b>{user.username}</b>!
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                Role: {user.role}
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                Email: {user.email}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h5"
              color="primary"
              align="center"
              gutterBottom
            >
              Please wait...
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          color="primary"
          style={cardMediaStyle}
          image={WeatherPic}
          alt="weather"
        />
        <CardContent>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            <WeatherIcon /> Weather
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
              Cloudy
            </span>
            <br />
            <span style={{ fontSize: "1.2em" }}>Semarang, Central Java</span>
            <br />
            <span style={{ fontSize: "1.2em" }}>Indonesia</span>
            <br />
            <span style={{ fontSize: "1.2em" }}>26°C</span>
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          style={cardMediaStyle}
          image={CalendarPic}
          alt="calendar"
        />
        <CardContent>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            <CalendarIcon />
            Calendar
          </Typography>
          <h2>{format(currentDate, "EEEE, MMMM d, y")}</h2>
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          style={cardMediaStyle}
          image={KanbanPic}
          alt="people-working"
        />
        <CardContent>
          <Badge
            color="secondary"
            badgeContent="New"
            overlap="circular"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              align="center"
              gutterBottom
            >
              Progress Board
            </Typography>
          </Badge>
          <Typography variant="body1" align="center" gutterBottom>
            A system that helps you or your fellow team to visualize the work
            and track the progress toward the goals.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
