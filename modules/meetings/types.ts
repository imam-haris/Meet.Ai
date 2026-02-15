import { inferRouterOutputs } from "@trpc/server"; ///This utility extracts the output types of all procedures.
import  type { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];

