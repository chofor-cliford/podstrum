import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...

    // Return the URL of the file
    return await ctx.storage.getUrl(storageId);
  },
});
