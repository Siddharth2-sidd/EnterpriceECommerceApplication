import {useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {resetPassword} from "../../api/authApi";

function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        
        if(!token){
            setError("Invalid or missing reset token");
            return;
        }

        if(newPassword != confirmPassword){
            setError("password not matched with comfirmPassword");
            return;
        }

        try{
            await resetPassword({token, newPassword, confirmPassword});
            setSuccess("Password reset successfully. Redirecting to login...");
            setTimeout(()=>{
                navigate("/login");
            },2000);
        }catch(error){
            console.log(error);
            setError(error.response?.data?.message || error.response?.data || "Password reset failed");
        }finally{
            setLoading(false);
        }

    };

    return(
        <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password"  value={newPassword}  onChange={(e) => setNewPassword(e.target.value)}  placeholder="Enter new password"  required/>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required/>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
    )
};

export default ResetPassword;