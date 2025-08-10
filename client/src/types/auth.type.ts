export interface signupInput {
    name : string;
    email : string;
    password : string;
    confirmPassword : string
}

export interface AxiosResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse extends AxiosResponse {
    user : {
        _id: string;
        name: string;
        email: string;
    }
}