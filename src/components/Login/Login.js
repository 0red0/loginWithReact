import React, {
   useEffect,
   useContext,
   useState,
   useReducer,
   useRef,
} from "react";

import AuthContext from "../../store/auth-context";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import Input from "../UI/Input";
import classes from "./Login.module.css";

const emailReducer = (state, action) => {
   if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.includes("@") };
   }
   if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.includes("@") };
   }
   return { value: "", isValid: false };
};
const passwordReducer = (state, action) => {
   if (action.type === "user-input") {
      return { value: action.val, isValid: action.val.trim().length > 6 };
   }
   if (action.type === "input-blur") {
      return { value: state.value, isValid: state.value.trim().length > 6 };
   }
   return { value: "", isValid: false };
};

const Login = (props) => {
   // const [enteredEmail, setEnteredEmail] = useState("");
   // const [emailIsValid, setEmailIsValid] = useState();
   // const [enteredPassword, setEnteredPassword] = useState("");
   // const [passwordIsValid, setPasswordIsValid] = useState();
   const [formIsValid, setFormIsValid] = useState(false);

   const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: "",
      isValid: null,
   });
   const [passwordState, dispatchPass] = useReducer(passwordReducer, {
      value: "",
      isValid: null,
   });

   const authCtx = useContext(AuthContext);

   const emailInputRef = useRef();
   const passwordInputRef = useRef();

   const { isValid: emailIsValid } = emailState;
   const { isValid: passwordIsValid } = passwordState;

   useEffect(() => {
      const identifier = setTimeout(() => {
         console.log("Validity check!");
         setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

      return () => {
         console.log("clean up");
         clearTimeout(identifier);
      };
   }, [emailIsValid, passwordIsValid]);

   const emailChangeHandler = (event) => {
      dispatchEmail({ type: "USER_INPUT", val: event.target.value });
      // setEnteredEmail(event.target.value);

      // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
   };

   const passwordChangeHandler = (event) => {
      dispatchPass({ type: "user-input", val: event.target.value });
      // setEnteredPassword(event.target.value);

      // setFormIsValid(emailState.isValid && emailState.value.includes("@"));
   };

   const validateEmailHandler = () => {
      // setEmailIsValid(emailState.isValid);
      dispatchEmail({ type: "INPUT_BLUR" });
   };

   const validatePasswordHandler = () => {
      // setPasswordIsValid(enteredPassword.trim().length > 6);
      dispatchPass({ type: "input-blur" });
   };

   const submitHandler = (event) => {
      event.preventDefault();
      if (formIsValid) {
         authCtx.onLogin(emailState.value, passwordState.value);
      } else if (!emailIsValid) {
         emailInputRef.current.focus();
      } else {
         passwordInputRef.current.focus();
      }
   };

   return (
      <Card className={classes.login}>
         <form onSubmit={submitHandler}>
            <Input
               ref={emailInputRef}
               type="email"
               label="E-Mail"
               isValid={emailIsValid}
               value={emailState.value}
               onChange={emailChangeHandler}
               onBlur={validateEmailHandler}
            ></Input>
            <Input
               ref={passwordInputRef}
               type="password"
               label="Password"
               isValid={passwordIsValid}
               value={passwordState.value}
               onChange={passwordChangeHandler}
               onBlur={validatePasswordHandler}
            ></Input>
            <div className={classes.actions}>
               <Button type="submit" className={classes.btn}>
                  Login
               </Button>
            </div>
         </form>
      </Card>
   );
};

export default Login;
