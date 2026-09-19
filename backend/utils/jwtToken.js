import {config} from "../config/env.js";
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const expiresAt = new Date(
    Date.now() + config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000
  );

  const options = {
    expires: expiresAt,
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax", // 'none' in production with HTTPS
    path: "/",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    expiresAt,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};


export { sendToken };
