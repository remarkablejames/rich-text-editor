import type { Editor } from '@tiptap/core';

import type { ExportPdfOptions } from '@/extensions/ExportPdf';

function printHtml(
  content: string,
  exportPdfOptions: Partial<ExportPdfOptions>
) {
  const iframe: HTMLIFrameElement = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position: absolute; width: 0; height: 0; top: 0; left: 0;'
  );
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page {
          size: ${exportPdfOptions.paperSize || 'A4'};
          margin: ${exportPdfOptions.margins?.top || '1in'} ${
            exportPdfOptions.margins?.right || '0.4in'
          } ${exportPdfOptions.margins?.bottom || '1in'} ${
            exportPdfOptions.margins?.left || '0.4in'
          };
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background: white;
        }

        .print-container {
          max-width: 100%;
          width: 100%;
          margin: 0 auto;
          padding: 0;
          background: white;
        }

        .print-container * {
          color: black !important;
          background: transparent !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }

        .print-container a:after {
          content: ' (' attr(href) ')';
          font-size: 90%;
        }

        .print-container img {
          max-width: 100% !important;
          height: auto !important;
          page-break-inside: avoid;
        }

        .print-container table {
          border-collapse: collapse;
          width: 100%;
        }

        .print-container th, .print-container td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@remarkablejames/rich-text-editor@latest/lib/style.css">
    </head>
    <body>
      <div class="print-container">
        ${content}
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  iframe.addEventListener('load', () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print failed', err);
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
  });
}

export function exportToPdf(
  editor: Editor,
  options: Partial<ExportPdfOptions> = {}
) {
  const content = editor.getHTML();
  const defaultOptions: ExportPdfOptions = {
    paperSize: 'A4',
    margins: {
      top: '1in',
      right: '0.4in',
      bottom: '1in',
      left: '0.4in',
    },
    divider: false,
    spacer: false,
    button: () => ({}),
  };
  printHtml(content, { ...defaultOptions, ...options });
}
