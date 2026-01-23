"use client";
import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FaGithub , FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(1, { message: "Password is required" }),
})

export const SignInView = () => {
    const router = useRouter();
    const [error,setError] = useState<String | null>(null);
    const [pending , setPending] = useState(false);
    const onSubmit = (data: z.infer<typeof formSchema>) =>{
        setError(null);
        setPending(true);
        authClient.signIn.email(
            {
                email : data.email,
                password : data.password
            },
            {
                onSuccess : ()=>{
                    router.push("/");
                },
                onError : ({error}) =>{
                    setError(error.message)
                }
            },
        )
        setPending(false);

    }
    const onSocial = (provider : "github" | "google") => {
        setError(null);
        setPending(true);
        authClient.signIn.social(
            {
                provider: provider
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: ({ error }) => {
                    setError(error.message);
                }
            }
        )
        setPending(false);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome Back
                                    </h1>
                                    <p>
                                        Login to your account
                                    </p>
                                </div>
                                {/* //Email */}
                                <div className="grid gap-3">
                                    <FormField
                                        // FORM FIELD ---> Connects a form field to react-hook-form  ------- Registers the field (email) with the form
                                        //Injects value, onChange, onBlur, ref via field
                                        //form field requires control , name--> key in form Data , render--> give access to field
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* FORM ITEM IS A WRAPPER FOR 1.LABEL 2.INPUT 3.ERROR */}
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    {/* Wraps the actual input element */}
                                                    <Input
                                                        type="email"
                                                        placeholder="n@example.com"
                                                        {...field} // it includes value onChange onBlur ref
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                {/* //Password */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="*****"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button
                                    type="submit"
                                    disabled={pending}
                                    className="w-full cursor-pointer">
                                    Sign in
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute
                                after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full cursor-pointer"
                                        onClick={()=>{onSocial("google")}}
                                        >
                                        <FaGithub/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full cursor-pointer"
                                        onClick={()=>onSocial("github")}
                                        >
                                        <FaGoogle/>
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                    Sign up
                                    </Link>

                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col
                    gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
                        <p className="text-2xl font semibold text-white">
                            Meet.Ai
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs
            text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#"> Terms of Service</a> and <a href="#">Privacy Policy</a>

            </div>
        </div>
    )
}