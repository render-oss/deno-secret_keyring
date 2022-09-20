import { Asserts } from "../dev_deps.ts";

if (Deno.build.os === "windows") {
  Deno.test("in/out test", () => {
    Asserts.assert(false);
  });
}

