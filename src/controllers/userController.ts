import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
type JwtPayload = {
  id: number;
};
export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const userExist = await userRepository.findOneBy({ email });
    if (userExist) {
      return res.send("E-mail Já Existe");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
    });
    await userRepository.save(newUser);
    const { password: _, ...user } = newUser;
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.send("E-mail ou senha inválidos");
    }
    const verifyPass = await bcrypt.compare(password, user.password as string);

    if (!verifyPass) {
      return res.send("E-mail ou senha inválidos");
    }
    const token = jwt.sign({ id: user.id }, "vitor123", { expiresIn: "8h" });
    const { password: _, ...userAuth } = user;
    return res.json({
      ...userAuth,
      token: token,
    });
  }
  async getProfile(req: Request, res: Response) {
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
  }
}
