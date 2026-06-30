import { VercelRequest, VercelResponse } from "@vercel/node";

const basicAuth = (req: VercelRequest, res: VercelResponse) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    return res.status(401).json({ error: "Authentication Required" });
  }

  const authValue = authHeader.split(" ")[1];
  const [user, pwd] = Buffer.from(authValue, "base64")
    .toString("utf-8")
    .split(":");

  // Check against environment variables
  const validUser = process.env.AUTH_USER;
  const validPass = process.env.AUTH_PASS;

  if (user === validUser && pwd === validPass) {
    return true;
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
  return res.status(401).json({ error: "Invalid Credentials" });
};

export default basicAuth;
