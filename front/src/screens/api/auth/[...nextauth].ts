import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginUserResponseDto } from "../../../interfaces/login-user-response.dto";
import { LoginUserDto } from "../../../interfaces/login-user.dto";
import { GetUserByTokenResponseDto } from "../../../interfaces/get-user-by-token-response.dto";
import { apiClient } from "../../../services/axios";

interface XX extends User {
  token: string;
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // console.log(credentials);

          const loginDto = <LoginUserDto>{
            email: credentials?.email ?? "",
            password: credentials?.password ?? "",
          };

          // Add logic here to look up the user from the credentials supplied
          const res = await apiClient.post<LoginUserResponseDto>(
            "users/login",
            loginDto
          );

          const token = res.data.data.token;

          // get user details
          const userReq = await apiClient.get<GetUserByTokenResponseDto>(
            "users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const user = userReq.data.data?.user;

          return <User>{
            name: token,
            email: user?.email,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
