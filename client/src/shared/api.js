import axios from "axios";

export default () => {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("auth_token");
  console.log(token)
  if (token) {
  //  axios.defaults.headers.common['AUTH_TOKEN'] = `Bearer ${token}` 
    axios.interceptors.request.use((config) => {
      config.headers.AUTH_TOKEN = `Bearer ${token}`;
      config.baseURL = baseURL;
      return config;
    });
    
  } else {
    axios.interceptors.request.use((config) => {
      config.headers.AUTH_TOKEN = null;
      config.baseURL = baseURL;
      return config;
    });
  }
};
