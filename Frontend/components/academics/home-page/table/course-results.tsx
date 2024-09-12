"use client"

import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import axios from 'axios'
import Link from "next/link"
import * as React from "react"
import { create } from 'zustand'
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useResultsStore } from "@/store/results"

type Store = {
    count: number
    userId: string
    setId: (id: string) => void
    inc: () => void
}

const useStore = create<Store>()((set) => ({
    count: 1,
    userId: "",
    setId: (id: string) => set({ userId: id }),
    inc: () => set((state) => ({ count: state.count + 1 })),
}))

export type Payment = {
    _id: string
    tags: string[]
    courseCode: string,
    instructor_primary: string,
    instructor_secondary: string
    description: string
    year: string
    semester: string
    uploaded_by: any
    batch: string
    link: string
    likes: string
}

const HandleVotes = ({ row }) => {
    const { inc, userId } = useStore();
    const [upvoted, setUpvoted] = useState<boolean>(false);
    const [downvoted, setDownvoted] = useState<boolean>(false);
    // const [likes, setLikes]=useState<number>(row.original.likes)

    useEffect(() => {

        if (row.original.peopleWhoLiked.includes(userId)) { setUpvoted(true); }
        else { setUpvoted(false) }
        if (row.original.peopleWhoDisliked.includes(userId)) { setDownvoted(true); }
        else { setDownvoted(false) }

        const likes = parseInt(row.original.likes, 10);
    }, [row.original.likes])

    const handleUpvote = async ({ _id, likes }: { _id: string, likes: number }) => {
        try {
            const token = localStorage.getItem('authToken')
            const res = await axios.put(`${process.env.BACKEND_URL}/api/v1/resource/like/${_id}`, { likes: likes + 1 }, { headers: { 'Authorization': `Bearer ${token}` } });
            inc();
        } catch (err) {
            console.log(err);
        }
    }

    const handleDownvote = async ({ _id, likes }: { _id: string, likes: number }) => {
        try {

            const token = localStorage.getItem('authToken')
            const res = await axios.put(`${process.env.BACKEND_URL}/api/v1/resource/dislike/${_id}`, { likes: likes - 1 }, { headers: { 'Authorization': `Bearer ${token}` } });
            inc();
        } catch (err) {
            console.error(err);
        }
    }

    const likes = parseInt(row.original.likes, 10);

    return (
        <div className="space-y-2">
            {/* <Button variant={`${upvoted?'default':'secondary'}`} className={`w-15 h-8 ${upvoted?'bg-gray-300':''}`} onClick={()=>handleUpvote({_id:row.original._id,likes:likes})}>
                    <IoMdArrowRoundUp size={20} />
                </Button>
                
                {likes===0&&<Button variant={`${downvoted?'default':'secondary'}`} disabled className="w-15 h-8" onClick={()=>handleDownvote({_id:row.original._id,likes:likes})}>
                    <IoMdArrowRoundDown size={20} />
                </Button>}
                {likes!==0&&<Button variant={`${downvoted?'default':'secondary'}`}  className={`w-15 h-8 ${downvoted?'bg-gray-300':''}`} onClick={()=>handleDownvote({_id:row.original._id,likes:likes})}>
                    <IoMdArrowRoundDown size={20} />
                </Button>} */}
        </div>
    )
}

export const columns: ColumnDef<Payment>[] = [
    {
        enableHiding: false,
        accessorKey: "vote",
        header: "",
        cell: ({ row }) => (
            <HandleVotes row={row} />
        ),
    },
    {
        accessorKey: "Author",
        // header: ({ column }) => {
        //     return (
        //         <div className="my-2">
        //             <Button
        //                 variant="ghost"
        //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //             >
        //                 Author
        //                 <CaretSortIcon className="ml-2 h-4 w-4" />
        //             </Button>
        //         </div>
        //     )
        // },
        header: () => {
            return (
                <div className="my-5">
                    Author
                </div>
            )
        },
        cell: ({ row }) => (
            <div>
                {row.original.uploaded_by.name}
                <br />
                {/* <span className="text-xs">Batch of {row.original.batch}</span> */}
                {/* <br /> */}
                <span className="text-xs text-muted-foreground">{row.original.likes} Upvotes</span>
            </div>
        ),
    },
    {
        accessorKey: "Course Code",
        header: "Course Code",
        cell: ({ row }) => (
            <div>
                <div className="my-1 text-white">{row.original.courseCode.toUpperCase()}</div>
            </div>
        ),
    },
    {
        accessorKey: "Description",
        header: "Description",
        cell: ({ row }) => (
            <div>
                <div className="my-1 text-muted-foreground">Offered by <span className="capitalize"> {row.original.instructor_primary} {row.original.instructor_secondary !== "" ? "& " + row.original.instructor_secondary : ""} </span> during Semester {row.original.semester}, {row.original.year}. {row.original.description} </div>
                <Button variant="outline" className="h-8 w-18">
                    <Link href={`/academics/course/${row.original._id}`}>
                        View
                    </Link>
                </Button>
            </div>
        ),
    },
    {
        accessorKey: "tags",
        header: () => <div className="text-right">Tags</div>,
        cell: ({ row }: any) => {
            const tags = row.getValue("tags");
            const rows = [];
            for (let i = 0; i < tags.length; i += 2) {
                rows.push(
                    <div className="text-right font-medium flex space-x-1">
                        {i % 4 === 0 ? (
                            <>
                                <Badge variant="default" className="my-0.5">#{tags[i]}</Badge>
                                {i + 1 < tags.length && <Badge variant="secondary" className="my-0.5">#{tags[i + 1]}</Badge>}
                            </>
                        ) : (
                            <>
                                <Badge variant="secondary" className="my-0.5">#{tags[i]}</Badge>
                                {i + 1 < tags.length && <Badge variant="default" className="my-0.5">#{tags[i + 1]}</Badge>}
                            </>
                        )}
                    </div>
                );
            }
            return rows;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.link)}
                        >
                            Copy link
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Bookmark</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function CourseResultsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [pageData, setPageData] = useState([]);
    // const data = useResultsStore((state : any) => state.results)
    const [data, setData] = useState<Payment[]>([]);
    const [results, setResults] = useResultsStore((state: any) => [state.results, state.setResults]);

    useEffect(() => {
        setData(results)
    }, [results]);

    const { count, setId } = useStore();

    useEffect(() => {
        const fetchTopResources = async () => {
            try {
                const token = localStorage.getItem('authToken')
                let k = 6
                const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/resource`, { headers: { 'Authorization': `Bearer ${token}` } });
                setResults(res.data.resources)
                setId(res.data.userId)
            } catch (err) {
                console.error(err);
            }
        };
        fetchTopResources();
    }, [count]);

    useEffect(() => {
        const getPageData = () => {
            const startIndex = pageIndex * pageSize;
            const endIndex = startIndex + pageSize;
            return data.slice(startIndex, endIndex);
        };

        setPageData(getPageData());
    }, [pageIndex, pageSize, data]);

    const table = useReactTable({
        data: pageData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {/* <Input
                    placeholder="Filter authors..."
                    value={(table.getColumn("uploaded_by")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("uploaded_by")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                /> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="bg-white hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
                </div>

                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                        disabled={pageIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(pageIndex + 1)}
                        disabled={pageData.length < pageSize}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
