import { Asserts } from "../dev_deps.ts";

if (Deno.build.os === "linux") {
  Deno.test("in/out test", () => {
    Asserts.assert(true);
  });
}

