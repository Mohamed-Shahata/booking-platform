export enum StatusCode {
  // Success
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,

  // Server Error
  INTERNAL_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}
