import {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
    CommandResponsiveDialog
} from "@/components/ui/command";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    options: Array<{
        id: string,
        value: string,
        children: ReactNode
    }>;
    onSelect: (value: string) => void,
    onSearch?: (value: string) => void,
    value: string,
    placeholder?: string,
    isSearchable?: boolean,
    className?: string
}
export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder,
    isSearchable,
    className
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOptions = options.find((option) => option.value === value);
    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                type="button"
                variant="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOptions && "text-muted-foreground",
                    className,
                )}>
                <div>
                    {selectedOptions?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog
            shouldFilter={!onSearch}
                open={open}
                onOpenChange={setOpen}>
                <CommandInput placeholder="Search..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No options found
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value)
                                setOpen(false)
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}


