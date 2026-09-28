import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
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
            
            const response = await login(formData.email, formData.password);
            console.log("Login Successfull", response);
            // login(response.accessToken, response.refreshToken);
            navigate("/");
        }catch(error){
            // console.log(error);
            setError(error?.response?.data?.message || "Invalid Email or Password");
        }finally{
            setLoading(false);
        }

    }
    return(
       <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                {error && (<div className="error-message">{error}</div>)}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder= "Email Address" value={formData.email} onChange={handleChange} required/>                    
                        <label>Password</label>
                        <input type="password" name="password" placeholder= "Password" value={formData.password} onChange={handleChange} required/>                  
                        <button type="submit" disabled={loading}>
                        {loading?"Logging in...":"Login"}
                        </button>
                    </div>
                </form>
                <p className="auth-link"> <Link to="/register">  Create an account  </Link> </p>
                <p className="auth-link"> <Link to="/forgot-password">  Forgot Password?  </Link> </p>
            </div>
        </div>
    );
}

export default Login;