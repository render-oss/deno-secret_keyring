import { Base64 } from "../deps.ts";
import { BaseProvider, BaseProviderArgs } from "./base_provider.ts";

export interface DummyProviderArgs extends BaseProviderArgs {
  file: string,
}

/**
 * FYI - Deno's locale constraints for localstorage are a little weird and
 * don't work with `deno compile`, so we aren't using that here.
 * 
 * 
 */
export class DummyProvider extends BaseProvider {
  // TODO:  consider file locking; `Deno.flock` is unstable so didn't want to jump to it
  //        this is super placeholder-y until we can come up with better per-platform
  //        options so maybe don't worry about it?

  private readonly decoder: TextDecoder = new TextDecoder('utf-8');

  constructor(
    private readonly args: DummyProviderArgs,
  ) {
    super(args);
    this.logger.warning(`Platform provider ${this.constructor.name} stores secrets locally and isn't secure. This is generally a fallback for when your platform lacks a better option. Contributions welcome! https://github.com/render-oss/deno-secret_keyring`);
  }

  private async readFile(): Promise<Record<string, string>> {
    try {
      const str = await Deno.readTextFile(this.args.file);

      return JSON.parse(str);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        this.logger.debug("Caught notfound when accessing secret store; returning empty.");
        return {};
      }

      throw err;
    }
  }

  private async writeFile(db: Record<string, string>): Promise<void> {
    const str = JSON.stringify(db, null, 2);

    await Deno.writeTextFile(this.args.file, str);
  }

  private async withFile<T>(fn: (db: Record<string, string>) => T | Promise<T>): Promise<T> {
    const db = await this.readFile();
    const ret = await fn(db);
    await this.writeFile(db);

    return ret;
  }
  
  async deleteValue(key: string): Promise<void> {
    await this.withFile((db) => {
      delete db[key];
    });
  }
  getValue(key: string): Promise<string | null> {
    return this.withFile((db) => {
      const v = db[key];

      if (!v) {
        return null;
      }

      const arr = Base64.decode(v);
      return this.decoder.decode(arr);
    });
  }
  setValue(key: string, value: string): Promise<string> {
    return this.withFile((db) => {
      db[key] = Base64.encode(value);

      return value;
    });
  }
}
