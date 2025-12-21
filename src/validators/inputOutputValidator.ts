export type IValidator<Input, Against> = {
  isValid(input: Input, against: Against): boolean;
};

export class InputOutputValidator implements IValidator<string, void> {
  isValid(input: string): boolean {
    return /^\d+$/.test(input);
  }
}
