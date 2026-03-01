"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { DataPagination } from "@/components/data-pagination";

export const MeetingView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filter,setFilter] = useMeetingsFilter();


    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filter
    }))
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row)=> router.push(`/meetings/${row.id}`)} />
            <DataPagination
            page={filter.page}
            totalPages={data.totalPages}
            onPageChanges={(page)=> setFilter({page})}/>
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time." />
            )}
        </div>
    )
}

export const MeetingsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds..."
        />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meetings"
            description="Something went wrong"
        />
    )
}