"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "better-auth/api";
import { useRouter } from "next/navigation";

export const HomeView = ()=>{
    const router = useRouter();
  const trpc = useTRPC();
  const {data} = useQuery(trpc.hello.queryOptions({text: "Haris"}));
  const {data : session} = authClient.useSession();

  return (
    <div className="flex flex-col p-4 gap-y-4">
      {data?.greeting}
    </div>
  )
}
