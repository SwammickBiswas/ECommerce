import CommonForm from "@/components/common/form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../../client/@/hooks/use-toast";
import { registerFormControls } from "../../../src/config/index";
import { registerUser } from "../../../src/store/authSlice/index";

const initialState = {
    useName:"",
    email:"",
    password:"",
}

function AuthRegister() {
    const [formData,setFormData] = useState(initialState)
        const dispatch = useDispatch();
        const navigate = useNavigate()
        const {toast} = useToast()

    function onSubmit (event){
        event.preventDefault()
        dispatch(registerUser(formData)).then((result) => {
            const { payload } = result;
            if (payload?.success) {
                toast({
                    title: payload?.message,
                });
                navigate("/auth/login");
            }
            else{
                toast({
                    title: payload?.message || "user already exits with this email",
                    variant:"destructive"
                });
            }
        });
    }
    console.log(formData);
    

    return ( 
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new Account</h1>
            <p className="mt-2">Already have an account?
                <Link className="font-medium text-primary ml-2 hover:underline" to={'/auth/login'}>Login</Link>
            </p>
            </div>
        <CommonForm formControls={registerFormControls} buttonText={"Sign up"} formData={formData} setFormData={setFormData} onSubmit={onSubmit}/>
        </div>
     );
}

export default AuthRegister;