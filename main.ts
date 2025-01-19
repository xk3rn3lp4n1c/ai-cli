// main.ts
import { ensureApiKey } from "./app/apiKeyService.ts";
import { cli } from "./app/cli.ts";

await ensureApiKey();
cli.parse(Deno.args);
