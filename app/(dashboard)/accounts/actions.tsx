"use client"

import { Button } from "@/components/ui/button"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger

 } from "@radix-ui/react-dropdown-menu"
import { Edit, MoreHorizontal } from "lucide-react"
type Props = {
    id: string
}

export const Actions = ({id} : Props) => {

    const {onOpen} = useOpenAccount();
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2 rounded-md shadow-lg">
                    <DropdownMenuItem
                        disabled={false}
                        onClick={() => onOpen(id)}
                        className="flex items-center gap-2 px-2 py-1 rounded-md h-auto w-full hover:bg-gray-100 focus-visible:outline-none"
                    >
                        <Edit className="size-4 mr-2" />
                        <span className="text-sm font-medium">Edit</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
