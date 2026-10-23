import { getUser } from '@netlify/identity';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { workspaces, wallets } from '../../db/schema.js';
export default async (req: Request) => {
  const user = await getUser();
  if (!user) return new Response('Sign in required', {status:401});
  try {
    if(req.method === 'GET') {
      const [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId,user.id));
      const [wallet] = await db.select().from(wallets).where(eq(wallets.userId,user.id));
      return Response.json({data:workspace?.data ?? {},balance:wallet?.balance ?? 0}, {headers:{'Cache-Control':'no-store'}});
    }
    if(req.method !== 'PUT') return new Response('Method not allowed',{status:405});
    const raw = await req.text();
    if(raw.length > 2000000) return new Response('Workspace too large',{status:413});
    const data = JSON.parse(raw);
    if(!data || typeof data !== 'object' || Array.isArray(data)) return new Response('Invalid workspace',{status:400});
    await db.insert(workspaces).values({userId:user.id,data}).onConflictDoUpdate({target:workspaces.userId,set:{data,updatedAt:new Date()}});
    return Response.json({saved:true});
  } catch {return Response.json({error:'Your workspace could not be synced. Your local copy is retained.'},{status:503});}
};
