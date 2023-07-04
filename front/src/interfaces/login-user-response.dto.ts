import { LoginResponse } from "../models/enums/login-response";

export class LoginUserResponseDto {
  message: LoginResponse | undefined;
  data: {
    token: string;
  } = { token: "" };
  errors: { [key: string]: any } = {};
}
