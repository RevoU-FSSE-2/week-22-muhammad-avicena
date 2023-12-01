import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import API_URL from "../../utils/API_URL";
import Column from "./Column";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import NewTaskCard from "../CardProject";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const token = sessionStorage.getItem("token");

  const [isAddTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    activity: "",
    dueDate: "",
    priority: "Low",
  });

  const fetchAndProcessData = useCallback(() => {
    axios
      .get(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const completedTasks = [];
        const incompleteTasks = [];
        const inProgressTasks = [];

        data.forEach((task) => {
          if (task.status === "Completed") {
            completedTasks.push(task);
          } else if (task.status === "Not Started") {
            incompleteTasks.push(task);
          } else if (task.status === "In Progress") {
            inProgressTasks.push(task);
          }
        });

        setCompleted(completedTasks);
        setIncomplete(incompleteTasks);
        setInProgress(inProgressTasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  const handleAddNewTask = () => {
    setAddTaskDialogOpen(true);
  };

  const handleAddTask = () => {
    console.log("New Task Data:", newTaskData);
    axios
      .post(
        `${API_URL}/todos`,
        {
          activity: newTaskData.activity,
          priority: newTaskData.priority,
          dueDate: newTaskData.dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        fetchAndProcessData();
        setAddTaskDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setNewTaskData({
      activity: "",
      dueDate: "",
      priority: "Low",
    });
  };

  const handleDialogInputChange = (event) => {
    const { name, value } = event.target;
    setNewTaskData({
      ...newTaskData,
      [name]: value,
    });
  };

  const handleDialogClose = () => {
    setAddTaskDialogOpen(false);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (source.droppableId == destination.droppableId) return;

    if (source.droppableId == 3) {
      setCompleted(removeItemById(draggableId, completed));
    } else if (source.droppableId == 2) {
      setInProgress(removeItemById(draggableId, inProgress));
    } else {
      setIncomplete(removeItemById(draggableId, incomplete));
    }

    if (destination.droppableId == 3) {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "Completed",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (destination.droppableId == 2) {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "In Progress",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "Not Started",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function removeItemById(_id, array) {
    return array.filter((item) => item._id != _id);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <NewTaskCard onAddNewTaskClick={() => handleAddNewTask()} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Column
            title={"TO DO"}
            tasks={incomplete}
            id={"1"}
            fetchData={fetchAndProcessData}
          />
          <Column
            title={"IN PROGRESS"}
            tasks={inProgress}
            id={"2"}
            fetchData={fetchAndProcessData}
          />
          <Column
            title={"DONE"}
            tasks={completed}
            id={"3"}
            fetchData={fetchAndProcessData}
          />
        </div>
      </DragDropContext>

      <Dialog open={isAddTaskDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Activity"
            name="activity"
            value={newTaskData.activity}
            onChange={handleDialogInputChange}
            fullWidth
            sx={{ marginTop: 3 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="dueDate"
              sx={{ marginTop: 3, marginRight: 2, display: "block" }}
              label={"Due Date"}
              views={["year", "month", "day"]}
              minDate={dayjs()}
              onChange={(date) =>
                setNewTaskData({ ...newTaskData, dueDate: date })
              }
              renderInput={(params) => <TextField {...params} />}
              fullWidth
            />
          </LocalizationProvider>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              name="priority"
              value={newTaskData.priority}
              onChange={handleDialogInputChange}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            sx={{ marginTop: 2 }}
          >
            Add Task
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
