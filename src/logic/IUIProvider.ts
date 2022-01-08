export interface IUIProvider {
  getUserText(title:string, promt: string): Promise<string|undefined>;
  runCommandInTerminal(cmd: string): Promise<boolean>;
}