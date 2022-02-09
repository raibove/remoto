import React, {useEffect, useState} from "react"
import { getLetter, registerUser} from "../../redux/actions/userAction";
import { connect } from "react-redux";
import {useParams} from "react-router-dom"
import store from "../../redux/store";
import {Table, Spin,Tag, Button, Input, notification, Steps} from "antd";
import "./Letter.css"
const Letter = (props)=>{
    const [loading, setLoading] = useState(true)
    const [newJoinee, setNewJoinee] = useState(null)
    const [nName, setNName] = useState("")
    const [saveLoading, setSaveLoading] = useState(false)

    let params = useParams();

    const close = () => {
        store.dispatch({ type: "SET_ALERT", payload: { message: null } });
    };      

    const openNotification = (err) => {
      notification["error"]({
        message: "Error in signup",
        description: err.message,
        onClose: close,
      });
    };  

    useEffect(() => {
      if (props.alert_message !== null && props.alert_message!= undefined) {
        openNotification(props.alert_message.data);
       console.log(props.alert_message.data)
      }
    }, [props.alert_message]);

    useEffect(()=>{
        if(props.newjoinee === null){
            props.getLetter(params.id)
        }else{
            let re = props.newjoinee
            console.log(re)
            setNewJoinee(re)
            setLoading(false)
        }
    },[props.newjoinee])

    const timeConverter = (timeStamp)=>{
        if(timeConverter==null || timeConverter==undefined)
            return ""
       // console.log(timeStamp)
        const tt = new Date(timeStamp)
        let date = tt.getUTCDate()
        let month = tt.getUTCMonth()
        let yr = tt.getUTCFullYear()
        return date+"/"+month+"/"+yr
    }

    const saveLetter =async ()=>{
      setSaveLoading(true)
//      console.log(nName)
      if(nName.toLowerCase() != newJoinee.name.toLowerCase()){
        openNotification({message:"Name not same as official"})
      }else{
        //alert("same")
        let data = {
          name: newJoinee.name,
          email: newJoinee.email
        }
        
        let r = await props.registerUser(params.id, data)
      }
      setSaveLoading(false)

    }

    return(
     <div>
        {loading===true?
        <div className="letter-loader">
         <Spin/>
        </div>
         :
        <div className="offer-letter-container">
            <div className="offer-letter">
                <h1 className="offer-letter-heading">Offer Letter</h1>
                <br/>
                <h3 className="letter-name">Date of joining: {timeConverter(newJoinee.doj)}</h3>
                <h3 className="letter-name">{newJoinee.name}</h3>
                
                <p className="letter-body">
                  We are excited to offer you a full-time position as a {newJoinee.status} at our Company. We look forward to work with you.
                  As per our discussion we’d like to offer you an annual starting salary of $60,000. As an employee of Company ABC, you will also have access to our comprehensive benefits program, which includes unlimited vacation days, health insurance, RRSPs and vacation reimbursement.
                  <br/>
                  <br/>

                  Please indicate your acceptance of the offer by entering your name in the input box below.
                  <br/>
                  <br/>
                  Congratulations on your offer!
                  <br/>
                  <br/>
                </p>
            </div>    
            
            <div>
              <p className="offer-req-name">Enter your name to confirm your acceptance.</p>
              <Input  onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    saveLetter();
                  }
                }} 
                className="offer-req-input" value={nName} onChange={(e)=>{setNName(e.target.value)}} placeholder={newJoinee.name}/>
              <Button loading={saveLoading} className="letter-save" type="primary" onClick={()=>{saveLetter()}}>Save</Button>
            </div>
        </div>
         }
     </div>
    )
}

const mapActionWithProps = {
    getLetter,
    registerUser,
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    newjoinee: state.user.newjoinee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Letter);
  