const initialState = {
    auth:false,
    alert_message: null,
    success_message: null,
}

const userReducer = (state=initialState, action) => {
    switch(action.type){
        case "SET_AUTH":
        return { ...state, auth: action.payload };
        case "SET_ALERT":
        return { ...state, alert_message: action.payload.message };  
        case "SUCCESS_DATA":
        return { ...state, success_message: action.payload };
      default:
      return state;
    }
}


export default userReducer;