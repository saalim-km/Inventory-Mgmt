"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
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
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    
    if (isLogin) {
      login({email: values.email, password: values.password}, {
        onSuccess: (data) => {
          toast.success(data.message);
          dispatch(userLogin(data.data));
          setIsSubmitting(false);
        },
        onError: (err) => {
          handleError(err);
          setIsSubmitting(false);
        }
      });
    } else {
      signup({
        name: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsLogin(true);
          setIsSubmitting(false);
        },
        onError: (err) => {
          handleError(err);
          setIsSubmitting(false);
        }
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-full"></div>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              {isLogin ? (
                <User className="h-8 w-8 text-blue-600" />
              ) : (
                <CheckCircle className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              {isLogin
                ? "Sign in to continue to your Inventory"
                : "Get started with your Inventory Management account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Formik
              initialValues={initialValues}
              validationSchema={isLogin ? authSchema.login : authSchema.register}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Full Name
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          className={`pl-10 ${errors.fullName && touched.fullName ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-500 text-sm flex items-center mt-1"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${errors.email && touched.email ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm flex items-center mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pr-10 ${errors.password && touched.password ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm flex items-center mt-1"
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pr-10 ${errors.confirmPassword && touched.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm flex items-center mt-1"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <button
                onClick={toggleAuthMode}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center justify-center w-full"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}