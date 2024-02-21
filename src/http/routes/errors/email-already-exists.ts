export class EmailAlreadyExists extends Error {
  constructor() {
    super('Esse email já existe')
  }
}
