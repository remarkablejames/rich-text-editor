import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

import PaywallSeparatorView from './components/PaywallSeparatorView';

/**
 * Options for the PaywallSeparator extension
 */
export interface PaywallSeparatorOptions extends GeneralOptions<PaywallSeparatorOptions> {
  /** HTML attributes to apply to the paywall separator */
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paywallSeparator: {
      /**
       * Insert a paywall separator at the current selection
       * Only one paywall separator is allowed per document
       */
      insertPaywall: () => ReturnType;
    };
  }
}

/**
 * PaywallSeparator extension for TipTap editor
 *
 * Creates a block-level node that acts as a paywall separator, similar to Patreon's paywall line.
 * The separator visually divides free content from premium content.
 *
 * Features:
 * - Block-level node that can be inserted anywhere in the document
 * - Prevents multiple paywall separators in a single document
 * - Serializes to HTML as `<hr data-paywall="true" />`
 * - Custom NodeView with visual overlay for content creators
 * - Draggable and insertable via commands
 */
export const PaywallSeparator = /* @__PURE__ */ Node.create<PaywallSeparatorOptions>({
  name: 'paywallSeparator',

  addOptions() {
    return {
      HTMLAttributes: {},
      divider: false,
      spacer: false,
      toolbar: true,
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.insertPaywall(),
          disabled: !editor.can().insertPaywall(),
          icon: 'Minus',
          shortcutKeys: ['mod', 'alt', 'P'],
          tooltip: t('editor.paywallSeparator.tooltip') || 'Insert paywall separator',
        },
      }),
    };
  },

  group: 'block',

  parseHTML() {
    return [
      {
        tag: 'hr[data-paywall="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'hr',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-paywall': 'true',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PaywallSeparatorView);
  },

  addCommands() {
    return {
      insertPaywall: () => ({ commands, state }) => {
        // Check if a paywall separator already exists in the document
        const { doc } = state;
        let paywallExists = false;

        doc.descendants((node) => {
          if (node.type.name === 'paywallSeparator') {
            paywallExists = true;
            return false; // Stop traversing
          }
        });

        // Prevent inserting if paywall already exists
        if (paywallExists) {
          return false;
        }

        return commands.insertContent({
          type: this.name,
        });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-p': () => this.editor.commands.insertPaywall(),
    };
  },
});
