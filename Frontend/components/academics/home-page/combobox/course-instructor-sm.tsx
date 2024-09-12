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
import axios from 'axios'
axios.defaults.withCredentials = true


export function CourseInstructorComboboxSm({instructors}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    // const [instructors, setInstructors] = React.useState([])
    const [filters, addFilter] = useFiltersStore((state: any) => [state.filters, state.addFilter])

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const token = localStorage.getItem('authToken');
    //             const res = await axios.get(
    //                 `${process.env.BACKEND_URL}/api/v1/courses/getInstructors`,
    //                 { headers: { 'Authorization': `Bearer ${token}` } }
    //             );

                
    //             // Assuming backendResponse is extracted from res.data
    //             const backendResponse = res.data.instructors;

    
    //             // Extracting value and label from backend response
    //             const mappedCodes = backendResponse.map(item => ({
    //                 value: item.instructor.toLowerCase(),
    //                 label: item.instructor
    //             }));
    
    //             setInstructors(mappedCodes);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    
    //     fetchData();
    // }, []);

    

    React.useEffect(() => {
        addFilter({ instructor: value })
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
