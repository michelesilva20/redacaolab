import { describe, expect, it } from 'vitest';
import { mockEssays } from '../mocks/essays';
import { sanitizeEssayHtml } from './sanitizeEssayHtml';

function parseSanitized(html: string): Document {
  return new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html');
}

function rootOf(html: string): HTMLElement {
  const documentTree = parseSanitized(html);
  return documentTree.getElementById('root') as HTMLElement;
}

describe('sanitizeEssayHtml', () => {
  it('preserva HTML legítimo do TipTap', () => {
    const dirty = `
      <h2>Introdução</h2>
      <p>Texto com <strong>negrito</strong>, <em>itálico</em> e <s>riscado</s>.</p>
      <p>Quebra<br>de linha.</p>
      <ul><li>Primeiro</li><li>Segundo</li></ul>
      <ol start="2"><li>Item</li></ol>
      <blockquote><p>Citação</p></blockquote>
    `;

    const sanitized = sanitizeEssayHtml(dirty);
    const root = rootOf(sanitized);

    expect(root.querySelector('h2')?.textContent).toBe('Introdução');
    expect(root.querySelector('strong')?.textContent).toBe('negrito');
    expect(root.querySelector('em')?.textContent).toBe('itálico');
    expect(root.querySelector('s')?.textContent).toBe('riscado');
    expect(root.querySelectorAll('p').length).toBeGreaterThanOrEqual(2);
    expect(root.querySelector('br')).not.toBeNull();
    expect(root.querySelectorAll('li')).toHaveLength(3);
    expect(root.querySelector('ol')?.getAttribute('start')).toBe('2');
    expect(root.querySelector('blockquote')?.textContent).toContain('Citação');
  });

  it('remove tags script e não deixa executáveis no DOM', () => {
    const sanitized = sanitizeEssayHtml('<p>ok</p><script>window.__xss=1</script><p>fim</p>');
    const root = rootOf(sanitized);

    expect(root.querySelectorAll('script')).toHaveLength(0);
    expect(root.textContent).toContain('ok');
    expect(root.textContent).toContain('fim');
    expect(sanitized.toLowerCase()).not.toContain('<script');
  });

  it('remove event handlers como onerror e onclick', () => {
    const sanitized = sanitizeEssayHtml(
      '<p onclick="alert(1)" onmouseover="alert(2)">texto</p><img src="x" onerror="alert(3)" />'
    );
    const root = rootOf(sanitized);

    expect(root.querySelector('[onclick]')).toBeNull();
    expect(root.querySelector('[onerror]')).toBeNull();
    expect(root.querySelector('[onmouseover]')).toBeNull();
    expect(root.querySelector('img')).toBeNull();
    expect(root.textContent).toContain('texto');
  });

  it('remove links com protocolo javascript:', () => {
    const sanitized = sanitizeEssayHtml(
      '<p><a href="javascript:alert(1)">clique</a> e <a href="https://exemplo.com">site</a></p>'
    );
    const root = rootOf(sanitized);

    expect(root.querySelectorAll('a')).toHaveLength(0);
    expect(root.textContent).toContain('clique');
    expect(root.textContent).toContain('site');
    expect(sanitized.toLowerCase()).not.toContain('javascript:');
  });

  it('remove SVG com conteúdo executável', () => {
    const sanitized = sanitizeEssayHtml(
      '<p>antes</p><svg><script>alert(1)</script><animate onbegin="alert(2)" /></svg><p>depois</p>'
    );
    const root = rootOf(sanitized);

    expect(root.querySelector('svg')).toBeNull();
    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('animate')).toBeNull();
    expect(root.textContent).toContain('antes');
    expect(root.textContent).toContain('depois');
  });

  it('remove iframes não permitidos', () => {
    const sanitized = sanitizeEssayHtml(
      '<p>texto</p><iframe src="https://evil.test"></iframe><iframe srcdoc="<script>alert(1)</script>"></iframe>'
    );
    const root = rootOf(sanitized);

    expect(root.querySelectorAll('iframe')).toHaveLength(0);
    expect(root.textContent).toContain('texto');
  });

  it('neutraliza HTML aninhado ou malformado', () => {
    const sanitized = sanitizeEssayHtml(
      '<p>seguro<scr<script>ipt>alert(1)</script></p><div><img src=x onerror=alert(1)></div>'
    );
    const root = rootOf(sanitized);

    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('[onerror]')).toBeNull();
    expect(root.textContent).toContain('seguro');
  });

  it('trata conteúdo vazio sem lançar', () => {
    expect(sanitizeEssayHtml('')).toBe('');
    expect(sanitizeEssayHtml('   ')).toBe('');
    expect(sanitizeEssayHtml(null)).toBe('');
    expect(sanitizeEssayHtml(undefined)).toBe('');
  });

  it('mantém o texto das redações mock existentes', () => {
    const textEssays = mockEssays.filter((essay) => essay.type === 'texto' && essay.content);

    expect(textEssays.length).toBeGreaterThan(0);

    for (const essay of textEssays) {
      const sanitized = sanitizeEssayHtml(essay.content);
      const root = rootOf(sanitized);
      const sample = essay.content!.slice(0, 40);

      expect(root.querySelector('script')).toBeNull();
      expect(root.querySelector('iframe')).toBeNull();
      expect(root.querySelector('svg')).toBeNull();
      expect(root.textContent).toContain(sample);
    }
  });
});
