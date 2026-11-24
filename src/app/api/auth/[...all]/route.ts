import { toNextJsHandler } from "better-auth/next-js";
import { assertAuthConfiguration, auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

function withConfigurationCheck(
  handler: (request: Request) => Promise<Response>,
) {
  return (request: Request) => {
    assertAuthConfiguration();
    return handler(request);
  };
}

export const GET = withConfigurationCheck(handlers.GET);
export const POST = withConfigurationCheck(handlers.POST);
