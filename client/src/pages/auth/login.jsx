import CommonForm from "@/components/common/form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToast } from "../../../../client/@/hooks/use-toast";
import { loginFormControls } from "../../../src/config/index";
import { loginUser } from "../../../src/store/authSlice/index";

const initialState = {
    
    email:"",
    password:"",
}

function AuthLogin() {
    const [formData,setFormData] = useState(initialState)
    const dispatch = useDispatch()
    const {toast} = useToast()
    function onSubmit (event){
        event.preventDefault();
        dispatch(loginUser(formData)).then(data=>{
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message || "Logged in successfully" ,
                })
            }else{
                toast({
                    title: data?.payload?.message || "Password or email is incorrect" ,
                    variant:"destructive"
                })
            }
        })
    }

    return ( 
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In to your account</h1>
            <p className="mt-2">Don't have an account?
                <Link className="font-medium text-primary ml-2 hover:underline" to={'/auth/register'}>Register</Link>
            </p>
            </div>
        <CommonForm formControls={loginFormControls} buttonText={"Login"} formData={formData} setFormData={setFormData} onSubmit={onSubmit}/>
        </div>
     );
}

export default AuthLogin;