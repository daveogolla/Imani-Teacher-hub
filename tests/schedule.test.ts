import { test, expect } from 'bun:test';
import { buildSchedule } from '../src/services/schedule';
import type { SchemeRow } from '../src/types';
const template:SchemeRow={id:'template',week:1,lesson:1,strand:'Numbers',subStrand:'Fractions',specificOutcomes:'Compare fractions',inquiryQuestions:'Which fraction is larger?',learningExperiences:'Use fraction strips',coreCompetencies:'Critical thinking',resources:'Fraction strips',assessment:'Compare three pairs'};
test('partial-week half-term dates contain no lesson content',()=>{
 const rows=buildSchedule([template],'2026-01-05','2026-01-16',5,[{start:'2026-01-07',end:'2026-01-09',label:'HALF TERM'}]);
 const breaks=rows.filter(r=>r.strand.includes('HALF TERM'));
 expect(breaks).toHaveLength(3);
 for(const row of breaks){expect(row.lesson).toBe(0);expect(row.learningExperiences).toBe('');expect(row.specificOutcomes).toBe('');expect(row.assessment).toBe('');}
 expect(rows.filter(r=>r.lesson>0)).toHaveLength(6);
});
test('closing date is blank and nothing is scheduled later',()=>{
 const rows=buildSchedule([template],'2026-01-05','2026-01-07',10,[]);
 expect(rows.filter(r=>r.lesson>0)).toHaveLength(4);
 expect(rows.at(-1)?.strand).toContain('END OF TERM');expect(rows.at(-1)?.learningExperiences).toBe('');
});
test('multiple school breaks remain blank',()=>{
 const rows=buildSchedule([template],'2026-01-05','2026-01-16',5,[{start:'2026-01-06',end:'2026-01-06',label:'Staff training'},{start:'2026-01-13',end:'2026-01-14',label:'School break'}]);
 expect(rows.filter(r=>r.lesson===0)).toHaveLength(4);
});
test('one lesson plan contains one detailed teaching entry',()=>{
 expect(buildSchedule([template],'2026-01-05','2026-01-16',5,[],true).filter(r=>r.lesson>0)).toHaveLength(1);
});
test('invalid dates, lesson counts and reversed intervals are rejected',()=>{
 expect(()=>buildSchedule([template],'2026-02-31','2026-04-01',5,[])).toThrow();
 expect(()=>buildSchedule([template],'2026-01-05','2026-01-01',5,[])).toThrow();
 expect(()=>buildSchedule([template],'2026-01-05','2026-01-16',0,[])).toThrow();
 expect(()=>buildSchedule([template],'2026-01-05','2026-01-16',5,[{start:'2026-01-09',end:'2026-01-07',label:'Invalid'}])).toThrow();
});
