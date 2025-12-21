export type IOutputAdapter = {
  render(message: string): void;
};

export class TerminalOutputAdapter implements IOutputAdapter {
  render(message: string): void {
    console.log(message);
  }
}
