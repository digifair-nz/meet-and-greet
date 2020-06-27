import axios from "axios";

const instance = axios.create({});

// (function () {
//   const token = localStorage.getItem("token");
//   if (token) {
//     instance.defaults.headers.common["auth-token"] = token;
//   }
// })();

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.common["auth-token"] = token;

  return config;
});
export default instance;
