import { Log } from "../test_helpers/log.ts";
import { Asserts } from "../dev_deps.ts";
import { DummyProvider } from "./dummy_provider.ts";

Deno.test("in/out test", async () => {
  const t = await Deno.makeTempFile();
  try {
    await Deno.remove(t);
    const provider = new DummyProvider({
      file: t,
    });

    const key = `dummykey-${Math.ceil(Math.random() * 1000)}`;
    const value = "my deno test value";

    Asserts.assertEquals(await provider.getValue(key), null);

    await provider.setValue(key, value);

    Asserts.assertEquals(await provider.getValue(key), value);

    await provider.deleteValue(key);

    Asserts.assertEquals(await provider.getValue(key), null);
  } finally {
    await Deno.remove(t);
  }
});
