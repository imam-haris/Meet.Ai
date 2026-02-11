import { inferRouterOutputs } from "@trpc/server"; ///This utility extracts the output types of all procedures.
import  type { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];


// inferRouterOutputs<AppRouter>----> becomes
// {
//   agents: {
//     getOne: /* return type of query */
//     getMany: /* return type */
//   }
// }


// export type AgentGetOne =
//   inferRouterOutputs<AppRouter>["agents"]["getOne"];
// This means:

// 👉 Go inside the router
// 👉 Go to "agents"
// 👉 Go to "getOne"
// 👉 Give me the return type of that query
