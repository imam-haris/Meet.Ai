import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(session){
        return (
            <HomeView/>
        )
    }
    return (
        <SignInView/>
    )
}
export default Page;