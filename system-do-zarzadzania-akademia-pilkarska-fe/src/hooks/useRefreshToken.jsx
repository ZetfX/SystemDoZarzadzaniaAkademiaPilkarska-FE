import AuthService from "../services/authService";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const refresh = async () => {
    const response = await AuthService.refreshToken(user.refreshToken);
    const accessToken = response.data.accessToken;
    user.accessToken = accessToken;
    localStorage.setItem("user", JSON.stringify(user));
    setAuth((prev) => {
      return {
        ...prev,
        role: user.role,
        accessToken: accessToken,
      };
    });
    return accessToken;
  };


  return refresh;
};
export default useRefreshToken;
