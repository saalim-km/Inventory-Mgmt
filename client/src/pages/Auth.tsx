"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { authSchema } from "../utils/formik/schemas";
import { handleError } from "../utils/error-handler";
import { userLogin } from "../store/userSlice";
import { useLogin, useSignup } from "../hook/useAuth";
import { Input } from "../components/ui/input";
import { useDispatch } from "react-redux";

export function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const dispatch = useDispatch();
  const { mutate: signup } = useSignup();
  const { mutate: login } = useLogin();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    if (isLogin) {
      login({email : values.email , password:values.password},{
        onSuccess:(data)=> {
          toast.success(data.message);
          console.log('kdfj;akljkfdla',data.data);
          dispatch(userLogin(data.data))
        },
        onError : (err)=> {
          handleError(err)
        }
      })
    } else {
      signup({
        name: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },{
        onSuccess : (data)=> {
          toast.success(data.message)
          setIsLogin(true)
        },
        onError: (err)=> {
          handleError(err)

        }
      })
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to your CRM account"
              : "Create a new CRM account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? authSchema.login : authSchema.register}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Field
                      as={Input}
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-600"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}