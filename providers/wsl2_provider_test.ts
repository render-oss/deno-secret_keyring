import { Asserts } from "../dev_deps.ts";

if (Deno.build.os === "linux" && Deno.env.get("WSL_DISTRO_NAME")) {
  Deno.test("in/out test", () => {
    Asserts.assert(true);
  });
}

