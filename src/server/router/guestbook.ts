import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const guestBookRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.guestbook.findMany({
          select: {
            name: true,
            message: true,
            id: true,
          },
        });
      } catch (error) {
        console.log("Error", error);
      }
    },
  })

  .query("getOne", {
    input: z.object({
      messageId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { messageId } = input;
      try {
        return await ctx.prisma.guestbook.findFirst({
          select: {
            name: true,
            message: true,
            id: true,
          },
          where: {
            id: messageId,
          },
        });
      } catch (error) {
        console.error(`Error getOne ${error}`);
      }
    },
  })

  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("postMessage", {
    input: z.object({
      name: z.string(),
      message: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
          },
        });
      } catch (error) {
        console.log(`Error : ${error}`);
      }
    },
  })
  .mutation("editPost", {
    input: z.object({
      message: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.guestbook.update({
          where: {
            id: input.id,
          },
          data: {
            message: input.message,
          },
        });
      } catch (error) {
        console.log(`editPost Error: ${error}`);
      }
    },
  });
