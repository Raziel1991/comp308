export function notFound(req, res) {
  res.status(404).json({ msg: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error( err);
  res.status(err.status || 500).json({ msg: err.message || "Server error" });
}
