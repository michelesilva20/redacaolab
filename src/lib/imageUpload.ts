export const MAX_ESSAY_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_ESSAY_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;

export type EssayImageKind = 'jpeg' | 'png';

export type EssayImageValidation =
  | { ok: true; kind: EssayImageKind; file: File }
  | { ok: false; code: EssayImageErrorCode; message: string };

export type EssayImageErrorCode =
  | 'empty'
  | 'too_large'
  | 'type'
  | 'signature'
  | 'unreadable';

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const GIF_MAGIC = [0x47, 0x49, 0x46, 0x38];
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];

function startsWith(bytes: Uint8Array, magic: number[]): boolean {
  if (bytes.length < magic.length) return false;
  return magic.every((value, index) => bytes[index] === value);
}

export function detectImageSignature(bytes: Uint8Array): EssayImageKind | null {
  if (startsWith(bytes, JPEG_MAGIC)) return 'jpeg';
  if (startsWith(bytes, PNG_MAGIC)) return 'png';
  return null;
}

function isDeniedSignature(bytes: Uint8Array): boolean {
  if (startsWith(bytes, GIF_MAGIC) || startsWith(bytes, PDF_MAGIC)) return true;
  const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 64)).trimStart();
  return head.startsWith('<svg') || head.startsWith('<?xml');
}

function mimeAllows(kind: EssayImageKind, mime: string): boolean {
  const normalized = mime.toLowerCase().trim();
  if (!normalized) return true;
  if (normalized === 'image/jpg') return kind === 'jpeg';
  if (normalized === 'image/jpeg') return kind === 'jpeg';
  if (normalized === 'image/png') return kind === 'png';
  return false;
}

export async function readFileHeader(file: File, length = 16): Promise<Uint8Array> {
  const slice = file.slice(0, length);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function validateEssayImage(file: File | null | undefined): Promise<EssayImageValidation> {
  if (!file) {
    return { ok: false, code: 'empty', message: 'Selecione um arquivo de imagem.' };
  }

  if (file.size <= 0) {
    return { ok: false, code: 'empty', message: 'O arquivo está vazio.' };
  }

  if (file.size > MAX_ESSAY_IMAGE_BYTES) {
    return {
      ok: false,
      code: 'too_large',
      message: 'A imagem deve ter no máximo 10 MiB.',
    };
  }

  let header: Uint8Array;
  try {
    header = await readFileHeader(file);
  } catch {
    return { ok: false, code: 'unreadable', message: 'Não foi possível ler o arquivo selecionado.' };
  }

  if (isDeniedSignature(header)) {
    return {
      ok: false,
      code: 'type',
      message: 'Envie apenas JPEG ou PNG. PDF, SVG e GIF não são aceitos.',
    };
  }

  const kind = detectImageSignature(header);
  if (!kind) {
    return {
      ok: false,
      code: 'signature',
      message: 'O arquivo não parece uma imagem JPEG ou PNG válida.',
    };
  }

  if (!mimeAllows(kind, file.type)) {
    return {
      ok: false,
      code: 'type',
      message: 'O tipo do arquivo não corresponde a uma imagem JPEG ou PNG.',
    };
  }

  return { ok: true, kind, file };
}
