import DOMPurify from 'dompurify';

/**
 * Tags that TipTap StarterKit (and close variants) can emit in essay HTML.
 * Anything else is dropped; text nodes inside forbidden tags are kept.
 */
export const ESSAY_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  's',
  'strike',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
] as const;

/** Only structural list attributes. No href/src/style/class/event handlers. */
export const ESSAY_ALLOWED_ATTR = ['start'] as const;

export const ESSAY_FORBIDDEN_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'textarea',
  'button',
  'select',
  'option',
  'svg',
  'math',
  'link',
  'meta',
  'base',
  'video',
  'audio',
  'source',
  'picture',
  'canvas',
  'template',
  'img',
  'a',
  'applet',
  'frame',
  'frameset',
] as const;

const PURIFY_CONFIG: Parameters<typeof DOMPurify.sanitize>[1] = {
  ALLOWED_TAGS: [...ESSAY_ALLOWED_TAGS],
  ALLOWED_ATTR: [...ESSAY_ALLOWED_ATTR],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  ALLOW_ARIA_ATTR: false,
  SAFE_FOR_TEMPLATES: true,
  FORBID_TAGS: [...ESSAY_FORBIDDEN_TAGS],
  FORBID_ATTR: [
    'style',
    'src',
    'srcset',
    'href',
    'xlink:href',
    'action',
    'formaction',
    'poster',
    'background',
  ],
  KEEP_CONTENT: true,
  USE_PROFILES: { html: true },
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  WHOLE_DOCUMENT: false,
};

let hooksInstalled = false;

function installPurifyHooks() {
  if (hooksInstalled) return;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) return;

    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith('on')) {
        node.removeAttribute(attribute.name);
        continue;
      }

      if (name === 'href' || name === 'src' || name === 'xlink:href' || name === 'action') {
        const value = attribute.value.trim().toLowerCase();
        if (
          value.startsWith('javascript:') ||
          value.startsWith('data:') ||
          value.startsWith('vbscript:')
        ) {
          node.removeAttribute(attribute.name);
        }
      }
    }
  });

  hooksInstalled = true;
}

export function sanitizeEssayHtml(dirty: string | null | undefined): string {
  if (dirty == null) return '';

  const source = String(dirty);
  if (source.trim() === '') return '';

  installPurifyHooks();
  return DOMPurify.sanitize(source, PURIFY_CONFIG);
}
