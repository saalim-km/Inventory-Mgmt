import * as Yup from "yup"

const validEmailProviders = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
]

export const authSchema = {
  login: Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test(
        "valid-provider",
        "Please use a valid email provider",
        (value) => {
          if (!value) return false
          const domain = value.split("@")[1]
          return validEmailProviders.includes(domain)
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
  register: Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test(
        "valid-provider",
        "Please use a valid email provider",
        (value) => {
          if (!value) return false
          const domain = value.split("@")[1]
          return validEmailProviders.includes(domain)
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  }),
}