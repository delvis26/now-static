import jwt from 'jsonwebtoken'

export async function VerifyToken(token) {
  try {
    const verify = jwt.verify(token, env.NOW_JWT_SECRET_WORD)

    return verify
  } catch {
    return null
  }
}
