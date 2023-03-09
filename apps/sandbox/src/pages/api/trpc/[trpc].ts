import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "@/env/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import Cors from "cors";
import {
  NextApiHandler,
  type NextApiRequest,
  type NextApiResponse,
} from "next";

const cors = Cors();

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

function withCors(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    return await handler(req, res);
  };
}

// export API handler
// @see https://trpc.io/docs/api-handler
export default withCors(
  createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  })
);

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await NextCors(req, res, {
//     // Options
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//     origin: "*",
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   });
//   // Create and call the tRPC handler
//   return createNextApiHandler({
//     router: appRouter,
//     createContext: createTRPCContext,
//     onError:
//       env.NODE_ENV === "development"
//         ? ({ path, error }) => {
//             console.error(
//               `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
//             );
//           }
//         : undefined,
//   })(req, res);
// };

// export default handler;
