"use client";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "./navigation";
import { ClerkLoaded, ClerkLoading, ClerkProvider, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export const Header = () => {
    const pathname = usePathname();
    const showFiltersRoutes = ["/", "/transactions"];

    const showFilters = showFiltersRoutes.includes(pathname);
    return (
        <header className="bg-gradient-to-b from from-blue-700 to-blue-500 px-4 py-8 
        lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <ClerkProvider afterSignOutUrl={"/"}>
                            <UserButton />
                        </ClerkProvider>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8  animate-spin text-slate-400"/>
                    </ClerkLoading>   
                </div>
                <WelcomeMsg/>
                {showFilters && (
                    <Suspense>
                        <Filters />
                    </Suspense>
                )}
                
            </div>
        </header>
    );
};