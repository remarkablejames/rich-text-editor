import TiptapTable from '@tiptap/extension-table';
import type { TableCellOptions } from '@tiptap/extension-table-cell';
import { TableHeader } from './components/TableHeader';
import type { TableHeaderOptions } from '@tiptap/extension-table-header';
import type { TableRowOptions } from '@tiptap/extension-table-row';
import TableActionButton from '@/extensions/Table/components/TableActionButton';
import type { GeneralOptions } from '@/types';
import type { TableCellBackgroundOptions } from './cell-background';
import { TableCellBackground } from './cell-background';
import { TableRow } from './components/TableRow';
import { TableCell } from './components/TableCell';

export interface TableOptions extends GeneralOptions<TableOptions> {
  HTMLAttributes: Record<string, any>;
  resizable: boolean;
  handleWidth: number;
  cellMinWidth: number;
  lastColumnResizable: boolean;
  allowTableNodeSelection: boolean;
  /** options for table rows */
  tableRow: Partial<TableRowOptions>;
  /** options for table headers */
  tableHeader: Partial<TableHeaderOptions>;
  /** options for table cells */
  tableCell: Partial<TableCellOptions>;
  /** options for table cell background */
  tableCellBackground: Partial<TableCellBackgroundOptions>;
}

export const Table = /* @__PURE__ */ TiptapTable.extend<TableOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        style: `
          border: 1px solid #d1d5db;
        border-collapse: collapse;
        table-layout: fixed;
        `,
      },
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,

      button: ({ editor, t }: any) => ({
        component: TableActionButton,
        componentProps: {
          disabled: editor.isActive('table') || false,
          icon: 'Table',
          tooltip: t('editor.table.tooltip'),
          editor,
        },
      }),
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = document.createElement('table');

      // Apply HTML attributes to the table
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'string') {
          dom.setAttribute(key, value);
        } else if (value !== null && value !== undefined) {
          dom.setAttribute(key, String(value));
        }
      });

      // Extract column widths from the first row
      const colwidths: number[] = [];
      const firstRow = node.content.firstChild;

      if (
        firstRow &&
                (firstRow.type.name === 'tableRow' ||
                    firstRow.type.name === 'tableHeader')
      ) {
        firstRow.content.forEach((cell) => {
          const colwidth = cell.attrs.colwidth;
          if (colwidth && Array.isArray(colwidth)) {
            colwidths.push(...colwidth);
          } else if (colwidth) {
            colwidths.push(colwidth);
          } else {
            // Default width if not specified
            colwidths.push(100);
          }
        });
      }

      // Create colgroup element
      if (colwidths.length > 0) {
        const colgroup = document.createElement('colgroup');
        colwidths.forEach((width) => {
          const col = document.createElement('col');
          if (width) {
            col.style.width = `${width}px`;
          }
          colgroup.appendChild(col);
        });
        dom.appendChild(colgroup);
      }

      // Create tbody for content
      const tbody = document.createElement('tbody');
      dom.appendChild(tbody);

      return {
        dom,
        contentDOM: tbody,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'table') {
            return false;
          }

          // Update colgroup when the table structure changes
          const existingColgroup = dom.querySelector('colgroup');
          if (existingColgroup) {
            existingColgroup.remove();
          }

          // Re-extract column widths from the updated node
          const newColwidths: number[] = [];
          const newFirstRow = updatedNode.content.firstChild;

          if (
            newFirstRow &&
                        (newFirstRow.type.name === 'tableRow' ||
                            newFirstRow.type.name === 'tableHeader')
          ) {
            newFirstRow.content.forEach((cell) => {
              const colwidth = cell.attrs.colwidth;
              if (colwidth && Array.isArray(colwidth)) {
                newColwidths.push(...colwidth);
              } else if (colwidth) {
                newColwidths.push(colwidth);
              } else {
                newColwidths.push(100);
              }
            });
          }

          // Create new colgroup
          if (newColwidths.length > 0) {
            const newColgroup = document.createElement('colgroup');
            newColwidths.forEach((width) => {
              const col = document.createElement('col');
              if (width) {
                col.style.width = `${width}px`;
              }
              newColgroup.appendChild(col);
            });
            dom.insertBefore(newColgroup, dom.querySelector('tbody'));
          }

          return true;
        },
      };
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    // Extract column widths from the first row of cells
    const colwidths: (number | null)[] = [];
    const firstRow = node.content.firstChild;

    if (
      firstRow &&
            (firstRow.type.name === 'tableRow' ||
                firstRow.type.name === 'tableHeader')
    ) {
      firstRow.content.forEach((cell) => {
        const colwidth = cell.attrs.colwidth;
        if (colwidth && Array.isArray(colwidth)) {
          colwidths.push(...colwidth);
        } else {
          colwidths.push(colwidth || null);
        }
      });
    }

    // Generate colgroup HTML
    const colgroup =
            colwidths.length > 0
              ? [
                'colgroup',
                {},
                ...colwidths.map((width) =>
                  width ? ['col', { style: `width: ${width}px` }] : ['col', {}]
                ),
              ]
              : null;

    // Return table with colgroup as first child
    const tableContent = ['tbody', 0];

    return [
      'table',
      HTMLAttributes,
      ...(colgroup ? [colgroup] : []),
      tableContent,
    ];
  },

  addExtensions() {
    return [
      TableRow.configure(this.options.tableRow),
      TableHeader.configure(this.options.tableHeader),
      TableCell.configure(this.options.tableCell),
      TableCellBackground.configure(this.options.tableCellBackground),
    ];
  },
});

export default Table;
