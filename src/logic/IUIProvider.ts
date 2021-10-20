export interface IUIProvider {
  getUserText(title:string, promt: string): Promise<string|undefined>;
}