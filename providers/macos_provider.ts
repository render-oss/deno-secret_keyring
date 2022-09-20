import { BaseProvider } from "./base_provider.ts";

export class MacOSProvider extends BaseProvider {
  deleteValue(key: string): void|Promise<void> {
    throw new Error("Method not implemented.");
  }
  getValue(key: string): string|Promise<string|null>|null {
    throw new Error("Method not implemented.");
  }
  setValue(key: string,value: string): string|Promise<string> {
    throw new Error("Method not implemented.");
  }
}
