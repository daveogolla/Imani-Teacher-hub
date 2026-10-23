import React, { useEffect, useState } from 'react';
import { getUser, login, signup, logout, handleAuthCallback, onAuthChange, requestPasswordRecovery, updateUser } from '@netlify/identity';
import { BookOpen, ArrowRight, LogOut } from 'lucide-react';
import { configureStorage, syncWorkspace } from '../services/storageService';
import App from '../App';
export function AccountGate(){
 const [user,setUser]=useState<any>(null),[ready,setReady]=useState(false),[mode,setMode]=useState<'login'|'signup'|'reset'>('login');
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[sync,setSync]=useState('');
 useEffect(()=>{
  let mounted=true;
  async function load(u:any){
   if(!mounted)return;
   setReady(false);setUser(u);
   if(!u)configureStorage('');
   if(u){
    configureStorage(u.id);
    try {
     const r=await fetch('/.netlify/functions/workspace');if(!r.ok)throw Error();
     const workspace=await r.json();
     for(const [key,value] of Object.entries(workspace.data)) if(!localStorage.getItem(`${u.id}:dirty`) && key.startsWith('cbchub_')) localStorage.setItem(`${u.id}:${key}`,JSON.stringify(value));
    }catch {setSync('Offline workspace · changes stay on this device until sync is available.');}
    const key=`${u.id}:cbchub_user_profile`;const old=JSON.parse(localStorage.getItem(key)||'{}');
    localStorage.setItem(key,JSON.stringify({...old,id:u.id,email:u.email,teacherName:old.teacherName||u.name||u.email?.split('@')[0]||'Teacher',role:old.role||'Teacher',schoolName:old.schoolName||'',tscNumber:old.tscNumber||''}));
   }
   setReady(true);
   if(u && localStorage.getItem(`${u.id}:dirty`)) void syncWorkspace().catch(()=>{});
  }
  const unsubscribe=onAuthChange((event,u)=>{if(event==='login'||event==='logout') void load(u);if(event==='recovery')setMode('reset');});
  void (async()=>{try{const cb=await handleAuthCallback();if(cb?.type==='recovery')setMode('reset');await load(await getUser());}catch{setMessage('Could not complete account verification. Try signing in again.');setReady(true)}})();
  const change=()=>{void syncWorkspace().then(()=>setSync('Workspace synced')).catch(()=>setSync('Saved on this device · cloud sync unavailable'));};
  window.addEventListener('workspace-change',change);window.addEventListener('online',change);
  return()=>{mounted=false;unsubscribe();window.removeEventListener('workspace-change',change);window.removeEventListener('online',change)};
 },[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage('');const f=new FormData(e.currentTarget);
  try{if(mode==='reset'){await updateUser({password:String(f.get('password'))});setMode('login');setMessage('Password updated.');}
   else if(mode==='signup'){const u=await signup(String(f.get('email')),String(f.get('password')),{full_name:String(f.get('name'))});setMessage(u.confirmedAt?'Account created.':'Check your email to confirm your account.');}
   else await login(String(f.get('email')),String(f.get('password')));
  }catch(e){setMessage(e instanceof Error?e.message:'Account request failed. Try again.')}finally{setBusy(false)}
 }
 if(!ready)return <div className="min-h-screen grid place-items-center bg-emerald-950 text-white">Opening CBC HUB…</div>;
 if(user && mode!=='reset')return <><div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2 bg-emerald-950 text-emerald-100 text-xs"><span>{user.email} · {sync||'Personal teaching workspace'}</span><button onClick={()=>void logout()} className="inline-flex gap-2 items-center"><LogOut size={14}/>Sign out</button></div><App/></>;
 return <div className="min-h-screen grid lg:grid-cols-2 bg-[#f5f3ec] text-slate-900"><section className="bg-[#123f34] text-white p-8 lg:p-20 flex flex-col justify-between gap-12"><div className="flex items-center gap-3 font-bold tracking-widest"><BookOpen/> CBC HUB</div><div><p className="text-amber-200 text-xs uppercase tracking-[.25em] mb-6">Made for Kenyan teachers</p><h1 className="text-4xl lg:text-6xl font-bold leading-tight">More time<br/>for teaching.</h1><p className="text-emerald-100 mt-6 max-w-sm leading-relaxed">Plan your term, shape your lessons, and keep every good idea in one place. PP1 through Grade 12, CBE and KCSE revision.</p></div><p className="text-sm text-emerald-200">Your classroom. Your curriculum. Your hub.</p></section><section className="p-8 lg:p-20 flex flex-col justify-center max-w-xl w-full mx-auto"><p className="text-xs uppercase tracking-widest text-emerald-800">Your teaching workspace</p><h2 className="text-3xl font-bold my-4">{mode==='signup'?'Start your account':mode==='reset'?'Set a new password':'Welcome back'}</h2><p className="text-slate-500 mb-8">{mode==='signup'?'Use your own email and name to personalise your documents.':'Sign in to continue planning your next great lesson.'}</p><form onSubmit={submit} className="space-y-5">{mode==='signup'&&<label className="block text-sm">Your name<input name="name" required autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"/></label>}{mode!=='reset'&&<label className="block text-sm">Email address<input id="account-email" name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"/></label>}<label className="block text-sm">Password<input name="password" type="password" required minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} className="mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"/></label><button disabled={busy} className="rounded-xl bg-emerald-900 text-white p-4 w-full flex justify-between items-center font-semibold disabled:opacity-50">{busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Save password':'Sign in'}<ArrowRight size={18}/></button></form><p role="status" className="text-sm text-emerald-800 my-4">{message}</p><button className="text-sm text-left underline" onClick={()=>setMode(mode==='signup'?'login':'signup')}>{mode==='signup'?'Already have an account? Sign in':'Create a CBC HUB account'}</button>{mode==='login'&&<button className="text-sm text-left mt-4 underline" onClick={async()=>{const email=(document.getElementById('account-email') as HTMLInputElement).value;if(!email){setMessage('Enter your email address first.');return}try{await requestPasswordRecovery(email);setMessage('Check your email for a reset link.')}catch{setMessage('Could not send a reset email. Try again.')}}}>Forgot password</button>}<p className="text-xs text-slate-500 mt-10">Install from your Android browser menu: Add to Home screen. Downloads cost KSh 15 each when payment service is connected.</p></section></div>;
}
