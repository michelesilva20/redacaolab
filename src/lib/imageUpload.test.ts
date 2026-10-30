import { describe, expect, it, vi } from 'vitest';
import { MAX_ESSAY_IMAGE_BYTES, validateEssayImage } from './imageUpload';

function fileFromBytes(bytes: number[], name: string, type: string, size?: number): File {
  const body = new Uint8Array(size ?? bytes.length);
  body.set(bytes.slice(0, body.length));
  return new File([body], name, { type });
}

const jpeg = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10];
const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

describe('validateEssayImage', () => {
  it('aceita JPEG e PNG válidos', async () => {
    await expect(validateEssayImage(fileFromBytes(jpeg, 'redacao.jpg', 'image/jpeg'))).resolves.toMatchObject({
      ok: true,
      kind: 'jpeg',
    });
    await expect(validateEssayImage(fileFromBytes(png, 'redacao.png', 'image/png'))).resolves.toMatchObject({
      ok: true,
      kind: 'png',
    });
  });

  it('aceita arquivo exatamente no limite de 10 MiB quando a assinatura é válida', async () => {
    const result = await validateEssayImage(
      fileFromBytes(jpeg, 'limite.jpg', 'image/jpeg', MAX_ESSAY_IMAGE_BYTES)
    );
    expect(result.ok).toBe(true);
  });

  it('rejeita arquivo maior que 10 MiB, vazio e tipos não autorizados', async () => {
    await expect(
      validateEssayImage(fileFromBytes(jpeg, 'grande.jpg', 'image/jpeg', MAX_ESSAY_IMAGE_BYTES + 1))
    ).resolves.toMatchObject({ ok: false, code: 'too_large' });

    await expect(validateEssayImage(new File([], 'vazio.jpg', { type: 'image/jpeg' }))).resolves.toMatchObject({
      ok: false,
      code: 'empty',
    });

    await expect(
      validateEssayImage(fileFromBytes([0x47, 0x49, 0x46, 0x38, 0x39, 0x61], 'anim.gif', 'image/gif'))
    ).resolves.toMatchObject({ ok: false, code: 'type' });

    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    await expect(
      validateEssayImage(new File([svg], 'vetor.svg', { type: 'image/svg+xml' }))
    ).resolves.toMatchObject({ ok: false });

    await expect(
      validateEssayImage(fileFromBytes([0x25, 0x50, 0x44, 0x46], 'doc.pdf', 'application/pdf'))
    ).resolves.toMatchObject({ ok: false });
  });

  it('não confia só na extensão ou no MIME declarado', async () => {
    await expect(
      validateEssayImage(fileFromBytes(png, 'falso.jpg', 'image/jpeg'))
    ).resolves.toMatchObject({ ok: false, code: 'type' });

    await expect(
      validateEssayImage(fileFromBytes([0x00, 0x01, 0x02, 0x03], 'redacao.jpg', 'image/jpeg'))
    ).resolves.toMatchObject({ ok: false, code: 'signature' });
  });

  it('trata falha de leitura sem aceitar o arquivo', async () => {
    const file = fileFromBytes(jpeg, 'ok.jpg', 'image/jpeg');
    vi.spyOn(file, 'slice').mockImplementation(() => {
      throw new Error('read fail');
    });
    await expect(validateEssayImage(file)).resolves.toMatchObject({ ok: false, code: 'unreadable' });
  });
});
