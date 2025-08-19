import * as Yup from "yup";

export const authSchema = {
  login: Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name cannot exceed 50 characters")
      .matches(
        /^[a-zA-Z\s]*$/,
        "Full name can only contain letters and spaces"
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
};

export const customerValidationSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .matches(
      /^[a-zA-Z0-9\s,.-]+$/,
      "Address can only contain letters, numbers, spaces, commas, periods, and hyphens"
    ),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
});

export const saleValidationSchema = Yup.object().shape({
  date: Yup.date()
    .required("Sale date is required")
    .max(new Date(), "Future dates are not allowed"),
  customerName: Yup.string().required("Customer name is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Item name is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one item must be selected"),
});

export const itemValidationSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  quantity: Yup.number().required("Quantity is required").min(0),
  price: Yup.number().required("Price is required").min(0),
  description: Yup.string().required("description is required"),
});
