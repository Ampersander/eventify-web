import { GetUserByTokenResponseDto } from "../../interfaces/get-user-by-token-response.dto";
import { LoginUserResponseDto } from "../../interfaces/login-user-response.dto";
import { LoginUserDto } from "../../interfaces/login-user.dto";
import { apiClient } from "../axios";

export const userApi = {
  register({ email, username, password, confirmPassword }: any) {
    const data = {
      username,
      email,
      password1: password,
      password2: confirmPassword,
    };
    return apiClient.post("users", data);
  },
  login: async (loginDto: LoginUserDto) => {
    const res = await apiClient.post<LoginUserResponseDto>(
      "users/login",
      loginDto
    );

    // console.log(res);

    const token = res.data.data.token;

    // get user details
    const userReq = await apiClient.get<GetUserByTokenResponseDto>("users", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    // console.log(userReq);

    return {
      ...userReq.data.data?.user,
      token,
    };
  },
  getUserByToken: (token: string) => {
    return apiClient.get<GetUserByTokenResponseDto>("users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
