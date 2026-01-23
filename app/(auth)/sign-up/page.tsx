import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(session){
        return <HomeView/>
    }
    return (
        <SignUpView/>
    )
}
export default Page;