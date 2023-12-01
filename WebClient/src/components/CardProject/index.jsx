import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import AddIcon from "@mui/icons-material/Add";
import TodayIcon from "@mui/icons-material/Today";
import { format } from "date-fns";
import KanbanPic from "../../assets/people-working.avif";

const cardMediaStyle = {
  height: 160,
  objectPosition: "center 40%",
};

const DashboardCard = ({ onAddNewTaskClick }) => {
  const currentDate = new Date();

  return (
    <Card variant="outlined" elevation={0}>
      <CardMedia
        component="img"
        style={cardMediaStyle}
        image={KanbanPic}
        alt="people-working"
      />
      <CardContent>
        <Typography variant="h5" color="primary" align="center" gutterBottom>
          PROGRESS BOARD
        </Typography>
        <Typography
          style={{ margin: 5 }}
          variant="h6"
          color="textSecondary"
          align="center"
        >
          <TodayIcon />
          {format(currentDate, "EEEE, MMMM d, y")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddNewTaskClick}
          fullWidth
        >
          Add New Task
        </Button>
      </CardContent>
    </Card>

    
  );
};

export default DashboardCard;
