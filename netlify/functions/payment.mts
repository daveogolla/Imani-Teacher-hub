import { getUser } from '@netlify/identity';
export default async (req: Request) => {
  if (!await getUser()) return new Response('Sign in required',{status:401});
  return Response.json({error:'Automatic M-Pesa checkout is not connected. A registered merchant account and verified payment callbacks are required before payments can credit your balance or release downloads. Do not send money expecting an automatic download yet.',price:15,recipient:'0707423879'},{status:503});
};
