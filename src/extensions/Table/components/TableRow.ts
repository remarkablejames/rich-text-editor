import { TableRow as TBRow } from '@tiptap/extension-table-row';

export const TableRow = TBRow.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        style: 'border-bottom: 1px solid #d1d5db;', /* Row borders */
      },
    };
  },
});