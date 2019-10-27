export default class MeteorError extends Error {
  constructor(error, reason) {
    super(error);

    this.name = 'MeteorError';
    this.error = error;
    this.reason = reason;
  }
}
