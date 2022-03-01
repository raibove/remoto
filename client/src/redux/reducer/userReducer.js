const initialState = {
    auth:false,
    alert_message: null,
    success_message: null,
    all_employee: null,
    pending_employee: null,
    employee: null,
    newjoinee: null,
    single_pending_employee:null,
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
        case "GET_EMPLOYEE":
        return {...state, employee: action.payload.employee}
        case "GET_PENDING_EMPLOYEE":
        return {...state, pending_employee: action.payload.pending_employee}
        case "GET_NEWJOINEE":
        return {...state, newjoinee: action.payload.newjoinee}
        case "GET_SINGLE_PENDING_EMPLOYEE":
        return {...state, single_pending_employee: action.payload.single_pending_employee}
      default:
      return state;
    }
}


export default userReducer;