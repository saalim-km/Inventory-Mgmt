import { useMutation } from "@tanstack/react-query"
import { authService } from "../service/auth-service"

export const useSignup = ()=> {
    return useMutation({
        mutationFn : authService.signUp
    })
}

export const useLogin = ()=> {
    return useMutation({
        mutationFn : authService.login
    })
}