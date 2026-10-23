import { test, expect } from 'bun:test';
import { configureStorage, storageService, syncWorkspace } from '../src/services/storageService';
const values=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)},configurable:true});
Object.defineProperty(globalThis,'window',{value:Object.assign(new EventTarget(),{atob:globalThis.atob,btoa:globalThis.btoa}),configurable:true});
test('saved profiles and ideas are isolated by account',()=>{
 configureStorage('account-a');storageService.saveUserProfile({id:'account-a',email:'a@example.test',teacherName:'Teacher A',tscNumber:'',schoolName:'',role:'Teacher'});
 configureStorage('account-b');expect(storageService.getUserProfile().teacherName).toBe('');expect(storageService.getContentIdeas()).toEqual([]);
 configureStorage('account-a');expect(storageService.getUserProfile().teacherName).toBe('Teacher A');
});
test('failed cloud synchronization retains local data and dirty marker',async()=>{
 configureStorage('account-a');const oldFetch=globalThis.fetch;globalThis.fetch=(async()=>new Response('',{status:503})) as unknown as typeof fetch;
 try {await expect(syncWorkspace()).rejects.toThrow();expect(values.has('account-a:dirty')).toBe(true);expect(storageService.getUserProfile().teacherName).toBe('Teacher A');}finally{globalThis.fetch=oldFetch;}
});
