import { IUser } from "./user.interface";

export class GetUserByTokenResponseDto {
  message: string = "";

  data:
    | {
        user: IUser;
      }
    | undefined;
  errors: { [key: string]: any } | null = null;
}
