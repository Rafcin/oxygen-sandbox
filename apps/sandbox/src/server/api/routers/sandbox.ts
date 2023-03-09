import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const sandboxRouter = createTRPCRouter({
  sandbox: publicProcedure.input(z.object({})).query(async ({}) => {
    return { data: "Hello World" };
  }),
});
