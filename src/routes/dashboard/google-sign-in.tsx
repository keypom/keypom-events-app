import { GoogleLogin } from "@react-oauth/google";

const GoogleSignInButton = ({
  handleGoogleLoginSuccess,
  handleGoogleLoginError,
}) => {
  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
      theme="filled_black"
      shape="circle"
      logo_alignment="center"
    />
  );
};

export default GoogleSignInButton;
