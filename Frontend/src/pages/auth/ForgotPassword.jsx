import {useState} from "react";
import {Link} from "react-router-dom";
import {forgotPassword} from "../../api/authApi";

function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);

        try{
            await forgotPassword({email});
            setSuccess("If email exits password reset link send");
        }catch(error){
            console.error(error);
            setError(error.response?.data?.message || error.response?.data || "unable to proccess your request");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <p className="auth-description">
          Enter your registered email address and we will send you a
          password reset link.
        </p>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input  type="email" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="Enter your email"  required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-link">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
    )
}

export default ForgotPassword;