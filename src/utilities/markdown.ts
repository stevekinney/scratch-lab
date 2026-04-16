import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ async: false });

export function renderMarkdown(source: string): string {
  const html = marked.parse(source) as string;
  return DOMPurify.sanitize(html);
}
