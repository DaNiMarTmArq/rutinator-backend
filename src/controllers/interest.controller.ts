import { Request, Response } from "express";
import * as interestService from "../services/interest.service";
import { HttpStatus } from "../errors/http.errors";
import { InterestDetails } from "../models/interfaces/interest.interfaces";
import { capitalizeWords } from "../utils/capitalize";

export async function addInterest(req: Request, res: Response) {
  const interestDetails: InterestDetails = {
    userId: req.params.userId,
    interestName: req.body.interestName,
  };
  const interest = await interestService.addInterest(interestDetails);
  res.status(HttpStatus.CREATED).json({
    success: true,
    interest,
  });
}

export async function getInterestsByUserId(req: Request, res: Response) {
  const interests = await interestService.getByUserId(req.params.userId);
  res.status(HttpStatus.OK).json(interests);
}

export async function removeInterestFromUser(req: Request, res: Response) {
  const { userId, interestName } = req.params;
  const interestNameUpper = capitalizeWords(interestName);
  await interestService.deleteInterestFromUser(userId, interestNameUpper);
  res.status(HttpStatus.NO_CONTENT).send();
}
