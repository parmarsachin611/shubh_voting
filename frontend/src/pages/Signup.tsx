import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import { db,auth } from "../firebase";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { toast } from "react-toastify";
const schema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().min(10).required(),
  verify: Yup.string().min(6).required(),
  citizenshipNumber: Yup.string().min(4).required(),
  password: Yup.string().min(3).required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "must be same as password")
    .required(),
});

const Signup = (): JSX.Element => {

  const navigate = useNavigate();

  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [ isDisabled, setIsDisabled ] = useState(true);
  const [showOtp , setShowOtp ] = useState(false);

  const generateRecaptcha = () => {

    (window as any).recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        console.log(response)
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
      }
    }, auth);

  }
  var getOtp = () => {
    
    var phone = `+91${(document.getElementById("phone") as HTMLInputElement).value}`;
    if (phone==="") {
      // toast.error("Enter Phone Number");
    } else if( phone.length < 13) {
      
      // toast.error("Invalid Phone Number");

    } else {

            console.log(phone);
            generateRecaptcha();

            let appVerifier = (window as any).recaptchaVerifier;


            signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              (window as any).confirmationResult = confirmationResult;
              // toast.success(`Otp Sent to ${phone}`);
              console.log("OTP Sent")
            }).catch((error) => {
              // toast.error("Something went wrong");
            });
            setShowOtp(true)
      }

  }

  var verifyOtp = () => {

    let code = (document.getElementById("verify") as HTMLInputElement).value;

    if (code.length === 6) {
      
      let confirmationResult = (window as any).confirmationResult;

      confirmationResult.confirm(code).then((result: any) => {
        console.log(result)
        console.log("Phone Number Verified");
        setIsDisabled(false);
      }).catch((error: any) => {
        console.log(error)
        // toast.error("Invalid OTP")

      });

    }

  }


  return (
    <div>
      <LoginLayout error={error} success={success}>
        <div className="form-container">
          <Formik
            initialValues={{
              name: "",
              email: "",
              phone: "",
              citizenshipNumber: "",
              password: "",
              confirm: "",
              verify:"",
            }}
            validationSchema={schema}
            onSubmit={({ name, email,phone, citizenshipNumber, password,verify }) => {
              axios
                .post("/auth/signup", {
                  name,
                  phone,
                  email,
                  citizenshipNumber,
                  password,
                  verify,
                })
                .then((res) => {
                  setError("");
                  setSuccess("Signup Successful!");
                })
                .catch((err) => {
                  let error: string = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error.slice(0, 50));
                });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    {...getFieldProps("name")}
                  />
                  <div className="form-error-text">
                    {touched.name && errors.name ? errors.name : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="citizenshipNumber"
                    type="text"
                    placeholder="Citizenship Number"
                    {...getFieldProps("citizenshipNumber")}
                  />
                  <div className="form-error-text">
                    {touched.citizenshipNumber && errors.citizenshipNumber
                      ? errors.citizenshipNumber
                      : null}
                  </div>
                </div>


                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...getFieldProps("email")}
                  />
                  <div className="form-error-text">
                    {touched.email && errors.email ? errors.email : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...getFieldProps("password")}
                  />
                  <div className="form-error-text">
                    {touched.password && errors.password
                      ? errors.password
                      : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Confirm Password"
                    {...getFieldProps("confirm")}
                  />
                  <div className="form-error-text">
                    {touched.confirm && errors.confirm ? errors.confirm : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="phone"
                    type="text"
                    placeholder="Phone Number"
                    {...getFieldProps("phone")}
                  />
                  <div className="form-error-text">
                    {touched.phone && errors.phone
                      ? errors.phone
                      : null}
                     
                  </div>
                </div>

               

                <button  type="button" onClick={getOtp}>
                  Send OTP
                </button>

                <hr />

                <div id="recaptcha-container"></div>
                {showOtp 
                  ?

                  <>

                <div className="input-container">
                  <input
                    id="verify"
                    type="text"
                    placeholder="OTP"
                    {...getFieldProps("verify")}
                  />
                  <div className="form-error-text">
                    {touched.verify && errors.verify
                      ? errors.verify
                      : null}
                  </div>
                  </div>
                  <button type="button" onClick={verifyOtp}>
                  Verify OTP
                </button>
                  
                  </>
                  
                :

                  null
                }

                  <hr/>


                <button className="button-primary" type="submit" disabled={isDisabled}>
                  Create a New Account
                </button>
              </form>
            )}
          </Formik>

          
          <div className="form-info-text">Already have an account?</div>

          <button
            onClick={() => navigate("/login")}
            className="button-secondary"
            type="button"
          >
            Login
          </button>
        </div>
        
      </LoginLayout>
    </div>
  );
};

export default Signup;
