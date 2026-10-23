import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle, Footer, PageNumber } from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SchemeDocument } from '../types';

export const exportService = {
  /**
   * Generates and downloads a Microsoft Word (.docx) document
   */
  async downloadDocx(scheme: SchemeDocument): Promise<void> {
    const primaryBorder = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: 'CCCCCC',
    };

    // Header cells for Scheme Table
    const tableHeaders = [
      'Wk',
      'Lsn',
      'Strand / Theme',
      'Sub-Strand / Topic',
      'Specific Learning Outcomes',
      'Key Inquiry Questions',
      'Learning Experiences',
      'Learning Resources',
      'Assessment'
    ];

    const headerRow = new TableRow({
      tableHeader: true,
      children: tableHeaders.map(text => (
        new TableCell({
          shading: { fill: '0D5C3A' }, // KICD Forest Green
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text,
                  bold: true,
                  color: 'FFFFFF',
                  size: 18, // 9pt
                })
              ]
            })
          ],
          borders: {
            top: primaryBorder,
            bottom: primaryBorder,
            left: primaryBorder,
            right: primaryBorder,
          }
        })
      ))
    });

    const dataRows = scheme.rows.map(row => (
      new TableRow({
        children: [
          // Wk
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${row.week}`, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Lsn
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${row.lesson}`, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Strand
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.strand, bold: true, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // SubStrand
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.subStrand, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Specific Outcomes
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.specificOutcomes, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Inquiry Questions
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.inquiryQuestions, italics: true, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Learning Experiences
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.learningExperiences, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Resources
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.resources, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          }),
          // Assessment
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.assessment, size: 16 })] })],
            borders: { top: primaryBorder, bottom: primaryBorder, left: primaryBorder, right: primaryBorder }
          })
        ]
      })
    ));

    const schemeTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows]
    });

    // Administrative approval signature paragraphs
    const signOffParagraphs: Paragraph[] = [
      new Paragraph({
        text: 'ADMINISTRATIVE APPROVALS & ENDORSEMENTS',
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Teacher in Charge: ', bold: true }),
          new TextRun({ text: `${scheme.teacherName} (TSC No: ${scheme.tscNumber})` }),
          new TextRun({ text: '    Signature: ______________________    Date: ____________' })
        ],
        spacing: { after: 180 }
      })
    ];

    if (scheme.includeHodSign) {
      signOffParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Head of Department (HoD): ', bold: true }),
            new TextRun({ text: 'Name: __________________________   Signature: ______________________   Date: ____________' })
          ],
          spacing: { after: 180 }
        })
      );
    }

    if (scheme.includeDeputySign) {
      signOffParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Deputy Principal (Academics): ', bold: true }),
            new TextRun({ text: 'Name: __________________________   Signature: ______________________   Date: ____________' })
          ],
          spacing: { after: 180 }
        })
      );
    }

    if (scheme.includePrincipalSign) {
      signOffParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Principal / Head Teacher: ', bold: true }),
            new TextRun({ text: 'Name: __________________________   Signature: ______________________   Official Rubber Stamp & Date: ____________' })
          ],
          spacing: { after: 180 }
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `CBC HUB Kenya · ${scheme.schoolName} · ${scheme.grade} ${scheme.subject} · Page `,
                      size: 16,
                      color: '666666'
                    }),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 16,
                      color: '666666'
                    }),
                    new TextRun({
                      text: ' of ',
                      size: 16,
                      color: '666666'
                    }),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES],
                      size: 16,
                      color: '666666'
                    })
                  ]
                })
              ]
            })
          },
          children: [
            // --- COVER PAGE ---
            new Paragraph({
              text: 'REPUBLIC OF KENYA',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 80 }
            }),
            new Paragraph({
              text: 'MINISTRY OF EDUCATION · STATE DEPARTMENT FOR BASIC EDUCATION',
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'KENYA INSTITUTE OF CURRICULUM DEVELOPMENT (KICD) STANDARDS',
                  italics: true,
                  size: 18,
                  color: '555555'
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: scheme.schoolName.toUpperCase(),
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: scheme.documentType === 'lesson_plan'
                    ? 'COMPETENCY BASED CURRICULUM (CBC) LESSON PLAN'
                    : 'COMPETENCY BASED CURRICULUM (CBC/CBE) SCHEMES OF WORK',
                  bold: true,
                  size: 28,
                  color: '0D5C3A'
                })
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `LEARNING AREA / SUBJECT: ${scheme.subject.toUpperCase()}  |  CLASS / LEVEL: ${scheme.grade.toUpperCase()}`,
                  bold: true,
                  size: 22
                })
              ],
              spacing: { after: 240 }
            }),
            // Meta Box Details
            new Paragraph({
              children: [
                new TextRun({ text: 'Academic Year: ', bold: true }),
                new TextRun({ text: `${scheme.year}      ` }),
                new TextRun({ text: 'Term: ', bold: true }),
                new TextRun({ text: `Term ${scheme.term}      ` }),
                new TextRun({ text: 'Lessons Per Week: ', bold: true }),
                new TextRun({ text: `${scheme.lessonsPerWeek} Lessons` })
              ],
              spacing: { after: 140 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Teacher\'s Name: ', bold: true }),
                new TextRun({ text: `${scheme.teacherName}      ` }),
                new TextRun({ text: 'TSC Number: ', bold: true }),
                new TextRun({ text: `${scheme.tscNumber}` })
              ],
              spacing: { after: 140 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Term Start Date: ', bold: true }),
                new TextRun({ text: `${scheme.termStartDate}      ` }),
                new TextRun({ text: 'Half Term Break: ', bold: true }),
                new TextRun({ text: `${scheme.halfTermDate}      ` }),
                new TextRun({ text: 'End Term Closing: ', bold: true }),
                new TextRun({ text: `${scheme.closingDate}` })
              ],
              spacing: { after: 280 }
            }),
            ...signOffParagraphs,
            // Page break before the structured scheme table
            new Paragraph({
              children: [new TextRun({ text: '', break: 1 })],
              pageBreakBefore: true
            }),
            // --- TABLE SECTION ---
            new Paragraph({
              text: `${scheme.schoolName} — ${scheme.grade} ${scheme.subject} (Term ${scheme.term})`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 150 }
            }),
            schemeTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `CBC_HUB_${scheme.grade.replace(/\s+/g, '_')}_${scheme.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Term${scheme.term}.docx`;
    
    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Generates and downloads a PDF document (.pdf)
   */
  exportToPdf(scheme: SchemeDocument): void {
    // Landscape A4 for wide curriculum tables
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ----------------------------------------------------
    // PAGE 1: COVER PAGE
    // ----------------------------------------------------
    // Border frame
    doc.setDrawColor(13, 92, 58); // KICD Forest Green
    doc.setLineWidth(1.2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner subtle border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header Titles
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('REPUBLIC OF KENYA', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text('MINISTRY OF EDUCATION · KENYA INSTITUTE OF CURRICULUM DEVELOPMENT (KICD)', pageWidth / 2, 31, { align: 'center' });

    // School Name Banner
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 92, 58);
    doc.text(scheme.schoolName.toUpperCase(), pageWidth / 2, 45, { align: 'center' });

    // Document Title
    doc.setFontSize(15);
    doc.setTextColor(30, 30, 30);
    const docTypeLabel = scheme.documentType === 'lesson_plan'
      ? 'COMPETENCY BASED CURRICULUM (CBC) LESSON PLAN'
      : 'COMPETENCY BASED CURRICULUM (CBC/CBE) SCHEMES OF WORK';
    doc.text(docTypeLabel, pageWidth / 2, 55, { align: 'center' });

    // Subject & Grade Box
    doc.setFillColor(243, 248, 245);
    doc.roundedRect(pageWidth / 2 - 80, 62, 160, 16, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setTextColor(13, 92, 58);
    doc.text(`LEARNING AREA: ${scheme.subject.toUpperCase()}  |  CLASS: ${scheme.grade.toUpperCase()}`, pageWidth / 2, 72, { align: 'center' });

    // Teacher & Term Details Grid
    const leftX = 25;
    const rightX = pageWidth / 2 + 10;
    let y = 92;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('TEACHER & INSTITUTION DETAILS', leftX, y);
    doc.text('ACADEMIC TERM CALENDAR & SCHEDULE', rightX, y);

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Instructor Name:  ${scheme.teacherName}`, leftX, y);
    doc.text(`Academic Year:  ${scheme.year} (Term ${scheme.term})`, rightX, y);

    y += 7;
    doc.text(`TSC Registration No:  ${scheme.tscNumber}`, leftX, y);
    doc.text(`Lessons Per Week:  ${scheme.lessonsPerWeek} Lessons`, rightX, y);

    y += 7;
    doc.text(`School Designation:  ${scheme.schoolName}`, leftX, y);
    doc.text(`Term Start Date:  ${scheme.termStartDate}`, rightX, y);

    y += 7;
    doc.text(`Curriculum Standard:  KICD CBC / CBE Standard`, leftX, y);
    doc.text(`Half-Term Break:  ${scheme.halfTermDate}`, rightX, y);

    y += 7;
    doc.text(`Paging:  Continuous Pagination Enforced`, leftX, y);
    doc.text(`End Term Closing:  ${scheme.closingDate}`, rightX, y);

    // Administrative Approvals Section
    y = 145;
    doc.setDrawColor(210, 210, 210);
    doc.line(leftX, y - 5, pageWidth - leftX, y - 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ADMINISTRATIVE SIGN-OFF & ENDORSEMENT', pageWidth / 2, y + 2, { align: 'center' });

    y += 12;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');

    // 3 Sign-off Columns
    const col1 = leftX;
    const col2 = leftX + 85;
    const col3 = leftX + 175;

    // Col 1: HoD
    if (scheme.includeHodSign) {
      doc.setFont('helvetica', 'bold');
      doc.text('Head of Department (HoD):', col1, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Sign: ____________________', col1, y + 7);
      doc.text('Date: ____________________', col1, y + 14);
      doc.text('Remarks: Approved for instruction', col1, y + 21);
    }

    // Col 2: Deputy Principal
    if (scheme.includeDeputySign) {
      doc.setFont('helvetica', 'bold');
      doc.text('Deputy Principal (Academics):', col2, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Sign: ____________________', col2, y + 7);
      doc.text('Date: ____________________', col2, y + 14);
      doc.text('Remarks: Verified syllabus pacing', col2, y + 21);
    }

    // Col 3: Principal
    if (scheme.includePrincipalSign) {
      doc.setFont('helvetica', 'bold');
      doc.text('Principal / Head Teacher:', col3, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Sign: ____________________', col3, y + 7);
      doc.text('Date: ____________________', col3, y + 14);
      
      // Stamp box
      doc.setDrawColor(150, 150, 150);
      doc.rect(col3, y + 17, 45, 16);
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text('OFFICIAL RUBBER STAMP', col3 + 4, y + 26);
      doc.setTextColor(40, 40, 40);
    }

    // Page 1 Footer Paging
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`CBC HUB · ${scheme.schoolName} · Cover Page 1`, pageWidth / 2, pageHeight - 14, { align: 'center' });

    // ----------------------------------------------------
    // PAGE 2+: TABLE CONTENT WITH AUTOTABLE & PAGING
    // ----------------------------------------------------
    const tableColumns = [
      { header: 'Wk', dataKey: 'week' },
      { header: 'Lsn', dataKey: 'lesson' },
      { header: 'Strand / Theme', dataKey: 'strand' },
      { header: 'Sub-Strand / Topic', dataKey: 'subStrand' },
      { header: 'Specific Learning Outcomes', dataKey: 'specificOutcomes' },
      { header: 'Key Inquiry Questions', dataKey: 'inquiryQuestions' },
      { header: 'Learning Experiences', dataKey: 'learningExperiences' },
      { header: 'Learning Resources', dataKey: 'resources' },
      { header: 'Assessment', dataKey: 'assessment' }
    ];

    const tableRows = scheme.rows.map(r => ({
      week: String(r.week),
      lesson: String(r.lesson),
      strand: r.strand,
      subStrand: r.subStrand,
      specificOutcomes: r.specificOutcomes,
      inquiryQuestions: r.inquiryQuestions,
      learningExperiences: r.learningExperiences,
      resources: r.resources,
      assessment: r.assessment
    }));

    autoTable(doc, {
      startY: pageHeight, // Force starting on Page 2
      columns: tableColumns,
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        valign: 'middle',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [13, 92, 58], // KICD Forest Green
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center'
      },
      columnStyles: {
        week: { cellWidth: 10, halign: 'center' },
        lesson: { cellWidth: 10, halign: 'center' },
        strand: { cellWidth: 26, fontStyle: 'bold' },
        subStrand: { cellWidth: 32 },
        specificOutcomes: { cellWidth: 54 },
        inquiryQuestions: { cellWidth: 38 },
        learningExperiences: { cellWidth: 48 },
        resources: { cellWidth: 32 },
        assessment: { cellWidth: 27 }
      },
      margin: { top: 20, bottom: 20, left: 10, right: 10 },
      didDrawPage: (data) => {
        // Draw custom header on table pages
        const currentPg = data.pageNumber;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(
          `${scheme.schoolName.toUpperCase()} — ${scheme.grade.toUpperCase()} ${scheme.subject.toUpperCase()} (Term ${scheme.term})`,
          10,
          12
        );
        doc.text(
          `Teacher: ${scheme.teacherName} (TSC: ${scheme.tscNumber}) | Lessons/Wk: ${scheme.lessonsPerWeek}`,
          pageWidth - 10,
          12,
          { align: 'right' }
        );

        // Footer with dynamic paging
        doc.setFontSize(8);
        doc.setTextColor(110, 110, 110);
        doc.text(
          `Document: CBC HUB Kenya · KICD Syllabus Standards · Downloaded via M-Pesa Ksh. 20 (0707423879)`,
          10,
          pageHeight - 8
        );
        doc.text(
          `Page ${currentPg}`,
          pageWidth - 10,
          pageHeight - 8,
          { align: 'right' }
        );
      }
    });

    const fileName = `CBC_HUB_${scheme.grade.replace(/\s+/g, '_')}_${scheme.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Term${scheme.term}.pdf`;
    doc.save(fileName);
  }
};
