import { Request, Response } from "express";
import * as interestService from "../services/interest.service";
import { HttpStatus } from "../errors/http.errors";
import { InterestDetails } from "../models/interfaces/interest.interfaces";

export async function addInterest(req: Request, res: Response) {
  const interestDetails: InterestDetails = {
    userId: req.params.userid,
    interestName: req.body.interestName,
  };
  const interest = await interestService.addInterest(interestDetails);
  res.status(HttpStatus.CREATED).json({
    success: true,
    interest,
  });
}

export async function getInterestsByUserId(req: Request, res: Response) {
  const interests = await interestService.getByUserId(req.params.userid);
  res.status(HttpStatus.OK).json(interests);
}
