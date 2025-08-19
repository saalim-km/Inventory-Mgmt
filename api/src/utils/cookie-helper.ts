import { Response } from "express";

export const setAuthCookies = (res : Response , accessToken : string , refreshToken : string , accessTokenName: string,refreshTokenName : string)=> {

    res.cookie(accessTokenName , accessToken , {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict"
    });

    res.cookie(refreshTokenName , refreshToken , {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "none"
    });    
}




export const updateCookieWithAccessToken = (
    res: Response,
    accessToken: string,
    accessTokenName: string
  ) => {
    const isProduction = process.env.NODE_ENV === "production";
  
    res.cookie(accessTokenName, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
};
  

export const clearAuthCookies = (
    res: Response,
    accessTokenName: string,
    refreshTokenName: string
  ) => {
    res.clearCookie(accessTokenName);
    res.clearCookie(refreshTokenName);
};
  