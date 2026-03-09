import readline from 'node:readline';

export interface IInputAdapter {
  ask(question: string): Promise<string>;
}

export class TerminalInputAdapter implements IInputAdapter {
  private readLine: readline.Interface;

  constructor(input: NodeJS.ReadableStream, output: NodeJS.WritableStream) {
    this.readLine = readline.createInterface({ input, output });
  }

  ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.readLine.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  close() {
    this.readLine.close();
  }
}
