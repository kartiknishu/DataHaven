"use client"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAddResourceStore } from "@/store/addResource"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import axios from 'axios'
axios.defaults.withCredentials = true

export function CourseInstructorCombobox({ type, defaultValue, instructors }: { type: string, defaultValue: string, instructors: Array<any>}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string>(() => defaultValue)

    const [resource, addResource] = useAddResourceStore((state: any) => [state.resource, state.addResource])

    React.useEffect(() => {
        if (type === "primary") addResource({ instructor_primary: value })
        else if (type === "secondary") addResource({ instructor_secondary: value })

    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? instructors.find((instructor) => instructor.value === value)?.label
                        : "Select instructor..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search instructor..." className="h-9" />
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                        {instructors.map((instructor) => (
                            <CommandItem
                                key={instructor.value}
                                value={instructor.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                {instructor.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === instructor.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
