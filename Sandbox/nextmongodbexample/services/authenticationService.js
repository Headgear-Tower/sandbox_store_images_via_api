import http from "./httpService";
import jwtDecode from "jwt-decode";

//const apiEndpoint = `${process.env.REACT_APP_API}authentication`;
const apiEndpoint = "http://localhost:3000/api/authentication";

const localStorageTokenKey = "jwtToken";

//User login
export async function authentication(details) {
  const { email, password } = details;
  const res = await http.post(`${apiEndpoint}`, {
    email,
    password,
  });
  console.log(res); //.headers["x-auth-token"]);
  localStorage.setItem(localStorageTokenKey, res.headers["x-auth-token"]);
}
