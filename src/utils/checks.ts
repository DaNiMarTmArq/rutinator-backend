import { UserNotFoundError } from "../errors/errors";
import { findById } from "../models/user.model";

export async function checkUserExists(userId: number) {
  const user = await findById(userId);
  if (!user) {
    throw new UserNotFoundError();
  }
  return true;
}
