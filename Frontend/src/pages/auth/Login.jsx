import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../services/authService";
import {useAuth} from "../../context/AuthContext";


function Login(){
    const navigate = useNavigate();
    const {login} = useAuth();
    const[formData, setFormData] = useState({email:"",password:""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData({...formData,[name]:value});
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(""); setLoading(true);
        try{
            const response = await loginUser(formData);
            // console.log("Login Successfull", response);
            login(response.accessToken, response.refreshToken);
            navigate("/");
        }catch(error){
            setError(error?.response?.data?.message || "Invalid Email or Password");
        }finally{
            setLoading(false);
        }

    }
    return(
       <div className="auth-container">
            <div className="auth-card">
                <h1>Login</h1>
                {error && (<p className="error">{error}</p>)}
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder= "Email Address" value={formData.email} onChange={handleChange} required/>                    
                    <input type="password" name="password" placeholder= "Password" value={formData.password} onChange={handleChange} required/>                  
                    <button type="submit" disabled={loading}>
                        {loading?"Logging in...":"Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;