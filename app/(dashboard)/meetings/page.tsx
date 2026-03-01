import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/meetings/params";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { MeetingsViewError, MeetingsViewLoading, MeetingView } from "@/modules/meetings/ui/views/meeting-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    searchParams: Promise<SearchParams>;
}
const Page = async ({searchParams} : Props) => {
    const filter = await loadSearchParams(searchParams);
    const session  = await auth.api.getSession({
        headers : await headers(),
    });
    if(!session){
        redirect("/sign-in")
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
            ...filter
        })
    );
    return (
        // Hydration ---> Taking data fetched by the server and reusing it by the client.
        <>
        <MeetingsListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                    <MeetingView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    )
}
export default Page;