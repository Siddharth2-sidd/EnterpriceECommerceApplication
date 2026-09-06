import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerUser} from "../services/authService";
import "../App.css";

function Register(){
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
  "firstName": "",
  "lastName": "",
  "email": "",
  "password": "",
  "confirmPassword": ""
});

    const [error,setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    };

    const handleSubmit = async (e)=>{
        
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        try{
            await registerUser(formData);
            setSuccess("Registration SuccessFull, Please Login.");

            setTimeout(()=>{
                navigate("/Login")
            },1500);
        }catch(error){
            setError(error?.response?.data?.message || "Registration Failed");
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Register</h1>
                {error && (<p className="error">{error}</p>)}
                {success && (<p className="success">{success}</p>)}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder= "First Name" value={formData.firstName} onChange={handleChange} required/>
                    <input type="text" name="lastName" placeholder= "Last Name" value={formData.lastName} onChange={handleChange} required/>
                    <input type="email" name="email" placeholder= "Email" value={formData.email} onChange={handleChange} required/>
                    <input type="password" name="password" placeholder= "Password" value={formData.password} onChange={handleChange} required/>
                    <input type="password" name="confirmPassword" placeholder= "ConfirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
                    <button type="submit" disabled={loading}>
                        {loading?"Create Account..":"Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;