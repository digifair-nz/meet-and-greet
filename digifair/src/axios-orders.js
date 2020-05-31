import axios from "axios";

const instance = axios.create({});

(function () {
  const token = localStorage.getItem("token");
  if (token) {
    instance.defaults.headers.common["auth-token"] = token;
  }
})();

export default instance;
