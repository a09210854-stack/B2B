import { getCurrentUser } from './auth';
import { HttpError } from './httpError';

export async function requireAuth(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) throw new HttpError(401, 'Unauthorized');
  return user;
}

export async function requireRole(req: Request, roles: Array<'buyer'|'seller'|'admin'>) {
  const user = await requireAuth(req);
  if (!roles.includes(user.role as any)) throw new HttpError(403, 'Forbidden');
  return user;
}
