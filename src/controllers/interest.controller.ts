import { Request, Response } from "express";
import * as interestService from "../services/interest.service";
import { HttpStatus } from "../errors/http.errors";

export async function addInterest(req: Request, res: Response) {
  const result = await interestService.addInterest(req.body);
  res.status(HttpStatus.CREATED).json(result);
}
