import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  createUserOrder,
  syncUserCreation,
  syncUserDeleting,
  syncUserUpdating,
} from "@/app/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    syncUserCreation,
    syncUserDeleting,
    syncUserUpdating,
    createUserOrder,
  ],
});
