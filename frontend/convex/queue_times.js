import { mutation, query } from "./_generated/server";
import { customMutation } from "convex-helpers/server/customFunctions";
import { v } from "convex/values";

export const get = query({
  handler: async ({ db }) => {
    return await db.query("queue_times").order("desc").take(8000);
  },
});

const apiMutation = customMutation(mutation, {
  args: { apiKey: v.string() },
  input: async (ctx, { apiKey }) => {
    if (apiKey !== process.env.CONVEX_API_TOKEN) throw new Error("Invalid API key");
    return { ctx: {}, args: {} };
  },
});

export const put = apiMutation({
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