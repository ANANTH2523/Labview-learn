import { Fragment } from 'react';
import { parseBlocks, parseInline } from '../utils/mini-markdown';

const Inline = ({ text }: { text: string }) => (
  <>
    {parseInline(text).map((run, i) =>
      run.type === 'bold' ? (
        <strong key={i} className="font-semibold text-slate-50">{run.text}</strong>
      ) : run.type === 'code' ? (
        <code key={i} className="px-1 py-0.5 rounded bg-slate-950/70 text-amber-300 font-mono text-[0.85em]">{run.text}</code>
      ) : (
        <Fragment key={i}>{run.text}</Fragment>
      ),
    )}
  </>
);

/** Renders mentor answers (a small Markdown subset) as React elements; never injects HTML. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2.5 font-sans">
      {parseBlocks(text).map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <h4 key={i} className="font-bold text-amber-300 text-sm"><Inline text={block.text} /></h4>;
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul';
            return (
              <List key={i} className={`pl-5 space-y-1 ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
                {block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}
              </List>
            );
          }
          case 'table':
            return (
              <div key={i} className="overflow-x-auto">
                <table className="text-xs border-collapse">
                  <thead>
                    <tr>{block.header.map((h, j) => <th key={j} className="text-left px-2 py-1 border-b border-slate-600 font-semibold"><Inline text={h} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>{row.map((c, j) => <td key={j} className="px-2 py-1 border-b border-slate-700/60"><Inline text={c} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <p key={i}><Inline text={block.text} /></p>;
        }
      })}
    </div>
  );
}
