OUTDIR := "/tmp"

cache-deps:
	deno cache --lock=deps-lock.json --lock-write deps.ts
	deno cache --lock=dev_deps-lock.json --lock-write dev_deps.ts

deps:
	deno cache --lock=deps-lock.json deps.ts

dev-deps: deps
	deno cache --lock=dev_deps-lock.json dev_deps.ts

test:
	deno test --allow-env --allow-run --allow-write --allow-read