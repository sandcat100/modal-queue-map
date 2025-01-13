import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async ({ db }) => {
    return await db.query("queue_times").collect();
  },
});

export const put = mutation({
  args: {
    time: v.number(),
    resource_type: v.string(),
    value: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("queue_times", {
      time: args.time,
      resource_type: args.resource_type,
      value: args.value
    });
  },
});

