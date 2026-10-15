export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
  }

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "This origin is not allowed.",
    });
  }

  console.error("API error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
}
