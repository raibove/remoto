import axios from "axios";
const baseURL = process.env.REACT_APP_BACKEND_URL;


export const signup = (data) => async (dispatch) => {
    try {
      const res = await axios.post(`${baseURL}/user/register`, data);
      await dispatch({
        type: "SUCCESS_DATA",
        payload: "Account created Successfully",
      });
     // localStorage.setItem("dashboard_tour", false);
      return true;
    } catch (e) {
      let message = "Server error";
      console.log(e.response);
      dispatch({ type: "SET_ALERT", payload: { message: e.response} });
      return false;
    }
  };

  export const signin = (data) => async (dispatch) => {
    try {
      const res = await axios.post(`${baseURL}/user/login`, data);
      await dispatch({
        type: "SUCCESS_DATA",
        payload: "Login Success",
      });
      localStorage.setItem("auth_token", res.data.token);
      return true;
    } catch (e) {
      let message = "Server error";
      console.log(e.response);
      dispatch({ type: "SET_ALERT", payload: { message: e.response} });
      return false;
    }
  };
