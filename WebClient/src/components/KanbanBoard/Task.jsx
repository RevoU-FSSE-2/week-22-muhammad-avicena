import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import API_URL from "../../utils/API_URL";

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
`;
function bgcolorChange(props) {
  return props.isDragging
    ? "lightgreen"
    : props.isDraggable
    ? props.isBacklog
      ? "#F2D7D5"
      : "#DCDCDC"
    : props.isBacklog
    ? "#F2D7D5"
    : "#EAF4FC";
}

export default function Task({ task, index, fetchData }) {
  const [isEditing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = React.useState({
    activity: task.activity,
    dueDate: task.dueDate,
    priority: task.priority,
  });

  const priorities = ["High", "Medium", "Low"];

  const token = sessionStorage.getItem("token");

  const handleOpenEditModal = () => {
    setEditedTask({ ...task });
    setEditing(true);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") {
      return "success";
    } else if (status === "Not Started") {
      return "error";
    } else if (status === "In Progress") {
      return "warning";
    } else {
      return "primary";
    }
  };

  const getPriorityColor = (status) => {
    if (status === "Low") {
      return "success";
    } else if (status === "Medium") {
      return "warning";
    } else if (status === "High") {
      return "error";
    } else {
      return "primary";
    }
  };

  const getDueDateText = (dueDate) => {
    const dueDateObject = new Date(dueDate);
    const currentDate = new Date();

    const difference = dueDateObject - currentDate;
    const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return "Overdue";
    } else if (daysLeft === 0) {
      return "Due today";
    } else if (daysLeft === 1) {
      return "1 day left";
    } else {
      return `${daysLeft} days left`;
    }
  };

  const handleSaveEdit = (id) => {
    console.log(editedTask);
    axios
      .put(
        `${API_URL}/todos/${id}`,
        {
          activity: editedTask.activity,
          dueDate: editedTask.dueDate,
          priority: editedTask.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setEditing(false);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Draggable draggableId={`${task._id}`} key={task._id} index={index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: 2,
                fontSize: 11,
              }}
            >
              <span>
                <small>
                  #{task._id}
                  {"  "}
                </small>
              </span>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(task._id)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </div>
            <div style={{ padding: 2 }}>
              <TextContent style={{ fontSize: 15 }}>
                <strong>{task.activity}</strong>
              </TextContent>
              <TextContent>
                Priority:{" "}
                <Button
                  size="small"
                  variant={"contained"}
                  color={getPriorityColor(task.priority)}
                >
                  {task.priority}
                </Button>
              </TextContent>
              <TextContent>
                Status:{" "}
                <Button size="small" color={getStatusColor(task.status)}>
                  {task.status}
                </Button>
              </TextContent>
              <TextContent>Due : {getDueDateText(task.dueDate)}</TextContent>
            </div>
            <Icons>
              <div
                style={{
                  marginTop: 5,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <Button size="small" onClick={handleOpenEditModal}>
                    <EditIcon fontSize="small" sx={{ marginRight: 1 }} /> Edit
                  </Button>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    onClick={() => console.log(task)}
                    src={
                      "https://joesch.moe/api/v1/random?key=" + task.username
                    }
                    sx={{ width: 30, height: 30 }}
                  />
                  <div style={{ marginLeft: "5px", fontSize: "15px" }}>
                    <TextContent>{task.username}</TextContent>
                  </div>
                </div>
              </div>
            </Icons>
            {provided.placeholder}
          </Container>
        )}
      </Draggable>

      <Dialog open={isEditing} onClose={() => setEditing(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Activity"
            value={editedTask.activity}
            onChange={(e) =>
              setEditedTask({ ...editedTask, activity: e.target.value })
            }
            fullWidth
            sx={{ marginTop: 3 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ marginTop: 3, marginRight: 2, display: "block" }}
              label={"Due Date"}
              views={["year", "month", "day"]}
              onChange={(date) =>
                setEditedTask({ ...editedTask, dueDate: date })
              }
              renderInput={(params) => <TextField {...params} />}
              fullWidth
            />
          </LocalizationProvider>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={editedTask.priority}
              onChange={(e) =>
                setEditedTask({ ...editedTask, priority: e.target.value })
              }
            >
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ marginTop: 2 }}
            variant="contained"
            onClick={() => handleSaveEdit(task._id)}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
