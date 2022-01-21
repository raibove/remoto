const initialState = {
    auth:false,
    alert_message: null,
    success_message: null,
    all_employee: null
}

const userReducer = (state=initialState, action) => {
    switch(action.type){
        case "SET_AUTH":
        return { ...state, auth: action.payload };
        case "SET_ALERT":
        return { ...state, alert_message: action.payload.message };  
        case "SUCCESS_DATA":
        return { ...state, success_message: action.payload };
        case "GET_ALL_EMPLOYEE":
        return {...state, all_employee: action.payload.all_employee}
      default:
      return state;
    }
}


export default userReducer;