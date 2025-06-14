import { HttpStatus } from "./http.errors";

export class AppError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", HttpStatus.CONFLICT);
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", HttpStatus.NOT_FOUND);
  }
}

export class InvalidUserCredentials extends AppError {
  constructor() {
    super("Invalid email or password", HttpStatus.UNAUTHORIZED);
  }
}

export class TokenCreationError extends AppError {
  constructor() {
    super("Failed to create token", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InterestNotFoundError extends AppError {
  constructor() {
    super("Interest not found", HttpStatus.NOT_FOUND);
  }
}


export class AvailabilityError extends AppError {
  constructor() {
    super("Availability already exists for this slot.", HttpStatus.BAD_REQUEST);
  }
}

export class AvailabilityNotFoundError extends AppError {
  constructor() {
    super("Availability not found", HttpStatus.NOT_FOUND);

  }
}



export class GoalsNotFoundError extends AppError {
  constructor() {
    super("Goal not found", HttpStatus.NOT_FOUND);
  }
}