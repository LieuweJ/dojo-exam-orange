export class Player {
  constructor(
    private readonly name: string,
  ) {}
  getScreenName(): string {
    return this.name;
  }
}