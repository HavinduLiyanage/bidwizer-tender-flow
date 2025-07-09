import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const plan = searchParams.get("plan") || "pro";
    if (token && email) {
      fetch(`http://localhost:4000/api/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            // Redirect to step 3 of registration with emailConfirmed true and preserve plan
            navigate(`/multi-step-register?plan=${plan}`, { state: { step: 3, emailConfirmed: true } });
          } else {
            alert(data.error || "Confirmation failed.");
            navigate("/");
          }
        })
        .catch(() => {
          alert("Confirmation failed. Please try again later.");
          navigate("/");
        });
    } else {
      alert("Invalid confirmation link.");
      navigate("/");
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Confirming your email...</h2>
    </div>
  );
};

export default ConfirmEmail; 