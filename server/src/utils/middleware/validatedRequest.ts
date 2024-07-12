const { decodeJWT } = require("../http");

async function validatedRequest(request, response, next) {
  // When in development passthrough auth token for ease of development.
  // Or if the user simply did not set an Auth token or JWT Secret
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.AUTH_TOKEN ||
    !process.env.JWT_SECRET
  ) {
    next();
    return;
  }

  if (!process.env.AUTH_TOKEN) {
    response.status(401).json({
      error: "You need to set an AUTH_TOKEN environment variable.",
    });
    return;
  }

  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    response.status(401).json({
      error: "No auth token found.",
    });
    return;
  }

  const crypto = require("crypto");
  const { p } = decodeJWT(token);

  if (p === null) {
    response.status(401).json({
      error: "Token expired or failed validation.",
    });
    return;
  }

  if (!crypto.compareSync(p, crypto.hashSync(process.env.AUTH_TOKEN, 10))) {
    response.status(401).json({
      error: "Invalid auth credentials.",
    });
    return;
  }

  next();
}

export { validatedRequest };
