export type Block =
  | { type: 'heading'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'paragraph'; text: string };

export type Inline = { type: 'text' | 'bold' | 'code'; text: string };

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isTableSeparator = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l);
const cells = (l: string) => l.trim().slice(1, -1).split('|').map((c) => c.trim());

/** Parses the small Markdown subset used by mentor answers: headings, lists, tables, paragraphs. */
export function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (/^#{1,6}\s+/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/^#{1,6}\s+/, '').trim() });
      i++;
    } else if (isTableRow(line)) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isTableSeparator(lines[i])) rows.push(cells(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', header: rows[0] ?? [], rows: rows.slice(1) });
    } else if (/^\s*(?:[-*]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'list', ordered, items });
    } else {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^#{1,6}\s+/.test(lines[i]) &&
        !isTableRow(lines[i]) &&
        !/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i])
      ) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: 'paragraph', text: para.join(' ') });
    }
  }
  return blocks;
}

/** Splits a line into plain, **bold** and `code` runs. Unclosed markers stay literal. */
export function parseInline(text: string): Inline[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    .filter(Boolean)
    .map((part): Inline => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return { type: 'bold', text: part.slice(2, -2) };
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return { type: 'code', text: part.slice(1, -1) };
      return { type: 'text', text: part };
    });
}
