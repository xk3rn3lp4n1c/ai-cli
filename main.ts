// main.ts
import { ensureApiKey } from "./apiKeyService.ts";
import { cli } from "./cli.ts";

await ensureApiKey();
cli.parse(Deno.args);
