import * as trpc from "@trpc/server";

import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-champion-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const champion = prisma.champion.findFirst({ where: { id: input.id } });

      if (!champion) throw new Error("Champion not found");

      return champion;
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });

      return { success: true, vote: voteInDb };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
