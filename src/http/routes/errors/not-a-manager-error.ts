export class NotAManagerError extends Error {
  constructor() {
    super('O usuário não é um gerenciador do restaurante')
  }
}
