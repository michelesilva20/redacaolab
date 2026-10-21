import { sanitizeEssayHtml } from '../lib/sanitizeEssayHtml';

interface SafeEssayContentProps {
  html?: string | null;
  className?: string;
}

export function SafeEssayContent({ html, className }: SafeEssayContentProps) {
  const sanitized = sanitizeEssayHtml(html);

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
