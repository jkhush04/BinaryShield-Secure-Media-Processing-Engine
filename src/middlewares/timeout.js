import timeout from "connect-timeout";

export const requestTimeout = timeout("15s"); // 15 seconds max

export const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next();
};