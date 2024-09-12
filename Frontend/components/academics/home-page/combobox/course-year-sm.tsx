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
import { useFiltersStore } from "@/store/filters"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

const years = [
    {
        value: "2027",
        label: "2027",
    },
    {
        value: "2026",
        label: "2026",
    },
    {
        value: "2025",
        label: "2025",
    },
    {
        value: "2024",
        label: "2024",
    },
    {
        value: "2023",
        label: "2023",
    },
    {
        value: "2022",
        label: "2022",
    },
    {
        value: "2021",
        label: "2021",
    },
    {
        value: "2020",
        label: "2020",
    },
    {
        value: "2019",
        label: "2019",
    },
    {
        value: "2018",
        label: "2018"
    },
    {
        value: "2017",
        label: "2017"
    }
]

export function CourseYearComboboxSm() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [filters, addFilter] = useFiltersStore((state: any) => [state.filters, state.addFilter])

    React.useEffect(() => {
        addFilter({ year: value })
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
                        ? years.find((year) => year.value === value)?.label
                        : "Select year..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search year..." className="h-9" />
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                        {years.map((year) => (
                            <CommandItem
                                key={year.value}
                                value={year.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                {year.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === year.value ? "opacity-100" : "opacity-0"
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
