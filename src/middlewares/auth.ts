import { RequestHandler } from "express";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
type JwtPayload = {
  id: number;
};
export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.send("Não Autorizado");
  }

  const token = authorization;
  const { id } = jwt.verify(token, "vitor123") as JwtPayload;
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    return res.send("Usuario não Autenticado!");
  }

  const { password: _, ...userAuth } = user;
  if (userAuth) {
    return res.json({ userAuth });
  }
  req.user = userAuth;
  next();
};
