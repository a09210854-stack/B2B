import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function getCurrentUser(req: Request) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) return null;
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) return null;
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user;
  } catch (err) {
    return null;
  }
}

export function signJwt(userId: string) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}
