import { test, expect } from 'bun:test';
import { unzipSync, strFromU8 } from 'fflate';
import { exportService } from '../src/services/exportService';
import type { SchemeDocument } from '../src/types';
const document:SchemeDocument={id:'test',title:'Grade 8 Science',documentType:'scheme',schoolName:'Test School',teacherName:'Teacher',tscNumber:'123',grade:'Grade 8',subject:'Science',term:1,year:2026,lessonsPerWeek:5,termStartDate:'2026-01-05',halfTermDate:'2026-01-07 to 2026-01-09',closingDate:'2026-01-16',includeHodSign:true,includeDeputySign:true,includePrincipalSign:true,createdAt:'2026-01-01',rows:[{id:'break',week:1,lesson:0,strand:'HALF-TERM BREAK',subStrand:'',specificOutcomes:'',inquiryQuestions:'',learningExperiences:'',coreCompetencies:'',resources:'',assessment:''}]};
test('Word export contains personal cover, approval lines, break and page fields',async()=>{
 let captured:Blob|undefined;const originalCreate=URL.createObjectURL,originalRevoke=URL.revokeObjectURL;
 const oldDocument=globalThis.document;
 URL.createObjectURL=((blob:Blob)=>{captured=blob;return 'blob:test';}) as typeof URL.createObjectURL;URL.revokeObjectURL=()=>{};
 Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:()=>({click(){},href:'',download:''}),body:{appendChild(){},removeChild(){}}}});
 try {
  await exportService.downloadDocx(document);expect(captured).toBeDefined();
  const files=unzipSync(new Uint8Array(await captured!.arrayBuffer()));
  const body=strFromU8(files['word/document.xml']),footer=strFromU8(files['word/footer1.xml']);
  expect(body).toContain('Test School');expect(body).toContain('HALF-TERM BREAK');expect(body).toContain('Head of Department');expect(body).toContain('Principal');expect(footer).toContain('PAGE');expect(footer).toContain('NUMPAGES');
 }finally{URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke;Object.defineProperty(globalThis,'document',{value:oldDocument,configurable:true});}
});

test('PDF export paginates the cover and teaching table',async()=>{
 const {default:jsPDF}=await import('jspdf');
 const api=jsPDF.API as unknown as {save:(this:import('jspdf').jsPDF)=>import('jspdf').jsPDF};
 const originalSave=api.save;let result='';let pages=0;
 api.save=function(this:import('jspdf').jsPDF){result=this.output();pages=this.getNumberOfPages();return this;};
 try {exportService.exportToPdf(document);expect(pages).toBeGreaterThanOrEqual(2);expect(result).toContain('Page 1 of');expect(result).toContain('Page 2 of');expect(result).toContain('Test School');}
 finally{api.save=originalSave;}
});
