import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
//For creattion of user under admin login 
const [userName, setUserName] = useState("");
const [userEmail, setUserEmail] = useState("");
const [userPassword, setUserPassword] = useState("");
const [userRole, setUserRole] = useState("User");
  const role = localStorage.getItem("role");
  const [currentPage, setCurrentPage] = useState(1);
const tasksPerPage = 3;
//calc for pagination
const indexOfLastTask = currentPage * tasksPerPage;
const indexOfFirstTask = indexOfLastTask - tasksPerPage;

const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

 useEffect(() => {
  fetchTasks();

  if (role === "Admin") {
    fetchUsers();
  }
}, []);
//create user function for admin
const createUser = async () => {
  try {
    await API.post("/api/auth/register", {
      name: userName,
      email: userEmail,
      password: userPassword,
      role: userRole,
    });

    alert("User created");

    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserRole("User");

    fetchUsers(); // refresh dropdown
  } catch (err) {
    alert("Error creating user");
    console.log(err);
  }
};

  // CREATE TASK (ADMIN)
  const createTask = async () => {
    try {
      await API.post("/api/tasks", {
        title,
        description,
        assignedTo,
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");

      fetchTasks();
    } catch (err) {
      alert("Error creating task");
    }
  };

  // MARK COMPLETE
  const markComplete = async (id) => {
    try {
      await API.put(`/api/tasks/${id}`, {
        status: "Completed",
      });
      console.log("USERS DATA:", res.data);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };
const fetchUsers = async () => {
  try {
    const res = await API.get("/api/users");
    console.log("USERS:", res.data); // debug
    setUsers(res.data);
  } catch (err) {
    console.log(err);
  }
};
  // DELETE (ADMIN)
  const deleteTask = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="dashboard-container">
    <div className="dashboard-card">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard ({role})</h2>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* ADMIN CREATE */}
      {role === "Admin" && (
        <div className="create-section">
          <h3>Create Task</h3>

          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="input"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button className="primary-btn" onClick={createTask}>
            Create Task
          </button>
          <div className="create-section">
    <h3>Create User</h3>

    <input
      className="input"
      placeholder="Name"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />

    <input
      className="input"
      placeholder="Email"
      value={userEmail}
      onChange={(e) => setUserEmail(e.target.value)}
    />

    <input
      className="input"
      type="password"
      placeholder="Password"
      value={userPassword}
      onChange={(e) => setUserPassword(e.target.value)}
    />

    <select
      className="input"
      value={userRole}
      onChange={(e) => setUserRole(e.target.value)}
    >
      <option value="User">User</option>
      {/* <option value="Admin">Admin</option> */}
    </select>

    <button className="primary-btn" onClick={createUser}>
      Create User
    </button>
  </div>
        </div>
      )}

      {/* TASK LIST */}
      <div className="task-section">
        <h3>Tasks</h3>

        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          currentTasks.map((task) => (
            <div key={task._id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p className="status">
                Status: {task.status}
              </p>
<div className="pagination">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Prev
  </button>

  <span>Page {currentPage} of {totalPages}</span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
              <div className="actions">
                {task.status === "Pending" && (
                  <button
                    className="complete-btn"
                    onClick={() => markComplete(task._id)}
                  >
                    Mark Complete
                  </button>
                )}

                {role === "Admin" && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            
          ))
        )}
      </div>

    </div>
  </div>
);

}