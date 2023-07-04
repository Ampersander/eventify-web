import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GetUserByTokenResponseDto } from "../interfaces/get-user-by-token-response.dto";
import { LoginUserResponseDto } from "../interfaces/login-user-response.dto";
import { LoginUserDto } from "../interfaces/login-user.dto";
import { userApi } from "../services/api/user-api";
import { apiClient } from "../services/axios";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

export default function useUser() {
  // const { data: session } = useSession();
  // const { data: res } = useQuery("user", () =>
  //   userApi.getUserByToken(session?.user?.name as string)
  // );
  // return {
  //   ...res?.data.data,
  // };
}
