export type EssayErrorCode =
  | 'not_found'
  | 'forbidden'
  | 'not_draft'
  | 'invalid'
  | 'storage';

export class EssayDomainError extends Error {
  readonly code: EssayErrorCode;

  constructor(code: EssayErrorCode, message: string) {
    super(message);
    this.name = 'EssayDomainError';
    this.code = code;
  }
}

export class EssayStorageError extends EssayDomainError {
  constructor(message = 'Não foi possível salvar no armazenamento local desta demonstração.') {
    super('storage', message);
    this.name = 'EssayStorageError';
  }
}
