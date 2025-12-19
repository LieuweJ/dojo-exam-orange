// // adapters/terminalInputAdapter.ts
// import readline from 'node:readline';
// export interface IInputAdapter {
//   ask(question: string): Promise<string>;
// }
//
// export class InputAdapter implements IInputAdapter {
//   private readLine = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//
//   ask(question: string): Promise<string> {
//     return new Promise(resolve => {
//       this.readLine.question(question, answer => {
//         resolve(answer.trim());
//       });
//     });
//   }
//
//   close() {
//     this.readLine.close();
//   }
// }