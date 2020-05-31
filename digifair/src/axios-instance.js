import axios from "axios";

const token = localStorage.getItem("token");

 const instance = axios.create({
  headers: {
    "auth-token": token,
  },
  timeout: 10000,
});

export default instance;
