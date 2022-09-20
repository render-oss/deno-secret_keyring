import "../test_helpers/log.ts";
import { Asserts } from "../dev_deps.ts";
import { MacOSProvider } from "./macos_provider.ts";

if (Deno.build.os === "darwin") {
  Deno.test("in/out test", async () => {
    const provider = new MacOSProvider({
      prefix: "test",
    });
  
    const key = `dummykey-${Math.ceil(Math.random() * 1000)}`;
    const value = "my deno test value";

    try {
      await provider.getValue(key);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
    }

    await provider.setValue(key, value);

    Asserts.assertEquals(await provider.getValue(key), value);

    await provider.deleteValue(key);

    try {
      await provider.getValue(key);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
    }
  });
}

