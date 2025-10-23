import React from 'react';

import { NodeViewWrapper } from '@tiptap/react';

/**
 * PaywallSeparatorView - React NodeView component for the paywall separator
 *
 * Renders a horizontal rule with a visual overlay indicating the paywall boundary.
 * Shows different content for creators vs viewers.
 */
const PaywallSeparatorView: React.FC = () => {
  return (
    <NodeViewWrapper className="richtext-relative">
      <div className="richtext-relative richtext-my-4 richtext-select-none">
        {/* The actual separator line */}
        <hr
          className="richtext-h-[2px] richtext-border-0 richtext-bg-black"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #d4d4d4, #d4d4d4, #d4d4d4)',
          }}
        />

        {/* Visual overlay for creators */}
        <div className="richtext-absolute richtext-inset-0 richtext-flex richtext-items-center richtext-justify-center">
          <div
            className="richtext-rounded-none richtext-border richtext-bg-white richtext-px-3 richtext-py-1 richtext-text-xs richtext-font-medium richtext-text-orange-700 richtext-shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
            }}
          >
            🔒 Paywall — The content below is premium and will be hidden from unpaid users.
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default PaywallSeparatorView;
