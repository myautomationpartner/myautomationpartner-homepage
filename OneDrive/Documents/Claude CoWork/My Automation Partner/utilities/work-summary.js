const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel } = require('docx');
const fs = require('fs');

// Border styling
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E78" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: 1, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title
      new Paragraph({
        children: [new TextRun({ text: "My Automation Partner", bold: true, size: 36, color: "1F4E78" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      }),

      new Paragraph({
        children: [new TextRun({ text: "Static Sites Deployment - Work Summary", size: 28, color: "2E75B6" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 }
      }),

      new Paragraph({
        children: [new TextRun({ text: "Date: March 30, 2026", size: 20, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Executive Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Executive Summary")]
      }),

      new Paragraph({
        children: [new TextRun("Successfully set up GitHub repositories and Cloudflare Pages infrastructure for deploying two static HTML websites (My Automation Partner homepage and Dancescapes portal). Both sites are configured for automated deployment from GitHub and global CDN distribution via Cloudflare.")],
        spacing: { after: 240 }
      }),

      // Project Scope
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Project Scope")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Objective")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Deploy two static HTML websites using GitHub + Cloudflare Pages")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Eliminate manual VPS Docker management for static sites")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Enable zero-downtime auto-deployment from GitHub")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Leverage Cloudflare global CDN for performance")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // What Was Accomplished
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("What Was Accomplished")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1. GitHub Repository Setup")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Created myautomationpartner-homepage (public repository)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Created dancescapes-portal (public repository)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Pushed HTML files to GitHub with index.html naming convention")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Both repos configured with main branch as production")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2. Cloudflare Pages Configuration")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Connected both GitHub repositories to Cloudflare Pages")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Configured build settings (Framework: None, Root: /")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Enabled automatic deployments on GitHub push events")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Generated .pages.dev preview URLs")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Technical Details Table
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Technical Details")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 3280, 3280],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Site", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "GitHub Repository", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Cloudflare Pages URL", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Homepage")] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("myautomationpartner-homepage")] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("myautomationpartner-homepage.pages.dev")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Dancescapes")] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("dancescapes-portal")] })]
              }),
              new TableCell({
                borders, width: { size: 3280, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("dancescapes-portal.pages.dev")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Current Status
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Current Status")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Deployment Stage: In Progress", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("✓ GitHub repositories created and populated")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("✓ HTML files committed to GitHub")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("⏳ Cloudflare Pages projects pending final verification")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("⏳ Both .pages.dev URLs under validation")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Next Steps
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Next Steps")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Immediate (For Next Session):", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Verify both Cloudflare Pages deployments show green checkmarks")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Test both .pages.dev URLs in a browser to confirm HTML rendering")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Document the live URLs in a project status file")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        children: [new TextRun({ text: "Short-term (When Ready):", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Configure custom domains (if you own: myautomationpartner.com, dancescapesperformingarts.com, etc.)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Add custom domains to Cloudflare Pages projects")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("DNS automatically routes via Cloudflare (already in your stack)")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        children: [new TextRun({ text: "Future Deployments:", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Edit HTML files locally in: C:\\Users\\kenny\\OneDrive\\Documents\\Claude CoWork\\My Automation Partner")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Commit and push to GitHub (git push origin main)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Cloudflare Pages auto-deploys within 30-60 seconds")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Architecture Decision
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Architecture Decision")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Why Cloudflare Pages (Not Docker on VPS)?")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Static HTML sites don't need a VPS - they need global CDN distribution")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Cloudflare Pages is infinitely scalable (zero manual scaling)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Automatic HTTPS, automatic deployments, automatic DNS")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frees VPS resources for n8n workflows and API services")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Eliminates Docker/nginx/git server complexity")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // File Locations
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Key File Locations")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Source Files:", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("C:\\Users\\kenny\\OneDrive\\Documents\\Claude CoWork\\My Automation Partner\\homepage.html")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("C:\\Users\\kenny\\OneDrive\\Documents\\Claude CoWork\\My Automation Partner\\dancescapes-portal.html")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        children: [new TextRun({ text: "Documentation:", bold: true })]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("GITHUB-CLOUDFLARE-SETUP.md - Complete setup guide")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("github-setup.ps1 - PowerShell deployment script")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("github-setup.bat - Batch file deployment script")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Assumptions & Notes
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Assumptions & Notes")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("GitHub account: myautomationpartner (confirmed signed in)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Cloudflare account: Active with DNS management")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Git installed locally on user machine")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Cloudflare Pages: Free tier sufficient (no paid plan needed)")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Contact/Handoff
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Handoff Notes")]
      }),

      new Paragraph({
        children: [new TextRun("If another AI session takes over, verify in this order:")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Check https://github.com/myautomationpartner for both repos")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Check https://dash.cloudflare.com under Workers & Pages")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Test the two .pages.dev URLs in a browser")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("If deployments failed, check Cloudflare build logs and retry")]
      }),

      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // Footer
      new Paragraph({
        children: [new TextRun({ text: "End of Report", italics: true, size: 20, color: "666666" })],
        alignment: AlignmentType.CENTER
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("WORK-SUMMARY.docx", buffer);
  console.log("✓ WORK-SUMMARY.docx created successfully");
});
