"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "./meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "./update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "./upcoming-state";
import { ActiveState } from "./active-state";
import { CancelledState } from "./cancelled-state";
import { ProcessingState } from "./processing-state";
import { CompletedState } from "./completed-state";

interface Props{
    meetingId: string
}
export const MeetingIdView = ({meetingId}: Props)=>{
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [updateMeetingDialog , setUpdateMeetingDialog] = useState(false);
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id:meetingId
        })
    )
    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: ()=>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({})),
                router.push("/meetings")
            },
        })
    )
    const [RemoveConfirmation , confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will remove this meeting"
    )
    const handleRemoveMeeting = async()=>{
        const ok = await confirmRemove();
        if(!ok)return;
        await removeMeeting.mutateAsync({id:meetingId})
    }
    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCancelled = data.status === "cancelled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";
return (
    <>
    <RemoveConfirmation/>
    <UpdateMeetingDialog
    open={updateMeetingDialog}
    onOpenChange={setUpdateMeetingDialog}
    initialValues={data}/>
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
    <MeetingIdViewHeader
    meetingId={meetingId}
    meetingName={data.name}
    onEdit={()=>setUpdateMeetingDialog(true)}
    onRemove={handleRemoveMeeting}
    />
    {isCancelled && <CancelledState/>}

    {isUpcoming && (<UpcomingState
    meetingId={meetingId}
    onCancelMeeting={()=> {}}
    isCancelling={false}
    />)}
    {isActive && (<ActiveState meetingId={meetingId}/>)}
    {isProcessing && <ProcessingState/>}
    {isCompleted && <CompletedState data={data}/>}

    </div>
    </>
)
}
export const MeetingsIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds..."
        />
    )
}

export const MeetingsIdViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meetings"
            description="Something went wrong"
        />
    )
}