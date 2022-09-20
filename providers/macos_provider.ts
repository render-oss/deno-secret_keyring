import { Hex } from "../deps.ts";
import { BaseProvider, BaseProviderArgs } from "./base_provider.ts";

export interface MacOSProviderArgs extends BaseProviderArgs {
  prefix: string,
}

export class MacOSProvider extends BaseProvider {
  private readonly user: string;

  constructor(
    private readonly args: MacOSProviderArgs,
  ) {
    super(args);

    const u = Deno.env.get("USER");
    if (!u) {
      throw new Error("USER is undefined; something's wrong.");
    }

    this.user = u;
  }

  async deleteValue(key: string): Promise<void> {
    const cmd = [
      "security", "-q", 
      "delete-generic-password",
      "-C", "note",
      "-s", [this.args.prefix, key].join(''),
    ];

    this.logger.debug(`deleteValue cmd: ${cmd.join(' ')}`);
    const process = Deno.run({ cmd, stdout: 'null', stderr: 'null' });
    try {
      const status = await process.status();

      // 44 means "not found"
      if (!status.success && status.code !== 44) {
        throw new Error(`Error when invoking delete-generic-password: code ${status.code}. Command: [${cmd.join(' ')}]`);
      }
    } finally {
      process.close();
    }
  }

  async getValue(key: string): Promise<string | null> {
    const cmd = [
      "security", "-q",
      "find-generic-password",
      "-C", "note",
      "-s", [this.args.prefix, key].join(''),
      "-w",
    ];

    this.logger.debug(`getValue cmd: ${cmd.join(' ')}`);
    const process = Deno.run({ cmd, stdout: 'piped', stderr: 'null' });

    let output: Uint8Array;
    try {
      const status = await process.status();

      if (!status.success) {
        if (status.code === 44) {
          throw new Deno.errors.NotFound();
        }

        throw new Error(`Error when invoking find-generic-password: code ${status.code}. Command: [${cmd.join(' ')}]`);
      }
    } finally {
      output = await process.output();
      process.close();
    }

    return (new TextDecoder()).decode(output).replace(/\n$/, "");
  }

  async setValue(key: string, value: string): Promise<string> {
    const hexValue = (new TextDecoder()).decode(Hex.encode(new TextEncoder().encode(value)));

    const cmd = [
      "security", "-q", 
      "add-generic-password",
      "-a", this.user,
      "-s", [this.args.prefix, key].join(''),
      "-U",
      "-C", "note",
      "-X", hexValue
    ];

    this.logger.debug(`setValue cmd: ${cmd.join(' ')}`);
    const process = Deno.run({ cmd, stdout: 'null', stderr: 'null' });
    try {
      const status = await process.status();

      if (!status.success) {
        throw new Error(`Error when invoking add-generic-password: code ${status.code}. Command: [${cmd.join(' ')}]`);
      }

      return value;
    } finally  {
      process.close();
    }
  }
}
