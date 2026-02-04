import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    next();
  } catch {
    res.sendStatus(401);
  }
};
