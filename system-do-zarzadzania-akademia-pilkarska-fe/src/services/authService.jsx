import axios from "../api/axios";

const API_SIGN_IN = "/api/auth/signIn";
const API_SIGN_UP = "/api/auth/signUp";
const API_REFRESH_TOKEN = "/api/auth/refreshToken";

export class AuthService {
  login(email, password) {
    return axios
      .post(API_SIGN_IN, JSON.stringify({ email, password }),{
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, surname, email, password) {
    return axios.post(
      API_SIGN_UP,
      JSON.stringify({
        name,
        surname,
        email,
        password,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  refreshToken(refreshToken){
    return axios.post(API_REFRESH_TOKEN,JSON.stringify({refreshToken}),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
  }
 
}
export default new AuthService();
