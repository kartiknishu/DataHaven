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
import { useResultsStore } from "@/store/results"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import axios from "axios"
axios.defaults.withCredentials = true

export function CourseCodeComboboxSm({ codes }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    // const [codes, setCodes] = React.useState([])
    const [filters, addFilter] = useFiltersStore((state: any) => [state.filters, state.addFilter])
    const [results, setResults] = useResultsStore((state: any) => [state.results, state.setResults])

    const handleChange = async () => {
        try {
            if (filters.tags.length === 0 && filters.courseCode === "" && filters.courseTitle === "" && filters.instructor === "" && filters.semester === "" && filters.year === "") {
                const token = localStorage.getItem('authToken')
                let k = 6
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/resource`, { headers: { 'Authorization': `Bearer ${token}` } });
                setResults(res.data.resources)
            }
            else {
                const data = {
                    tags: filters.tags.length > 0 ? filters.tags : undefined,
                    courseCode: filters.courseCode !== "" ? filters.courseCode : undefined,
                    courseTitle: filters.courseTitle !== "" ? filters.courseTitle : undefined,
                    instructor: filters.instructor !== "" ? filters.instructor : undefined,
                    semester: filters.semester !== "" ? filters.semester : undefined,
                    year: filters.year !== "" ? filters.year : undefined
                };

                const token = localStorage.getItem('authToken')
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/resource/filterResources`, { params: data, headers: { 'Authorization': `Bearer ${token}` } });

                setResults(res.data.resources)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        addFilter({ courseCode: value })
    }, [value])

    React.useEffect(() => {
        handleChange()
    }, [filters.courseCode])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-64"
                >
                    {value
                        ? codes.find((code) => code.value === value)?.label
                        : "Select course code..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search course code..." className="h-9" />
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                        {codes.map((code) => (
                            <CommandItem
                                key={code.value}
                                value={code.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                {code.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === code.value ? "opacity-100" : "opacity-0"
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
