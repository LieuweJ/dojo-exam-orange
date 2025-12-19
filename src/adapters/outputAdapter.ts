export type IOutputAdapter = {
  render(message: string): void;
}

export class OutputAdapter implements IOutputAdapter {
  render(message: string): void {
    console.log(message);
  }
}