import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import axios from "axios"
import * as React from "react"
import { set } from "react-hook-form"
axios.defaults.withCredentials = true
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CourseTags } from "@/components/academics/home-page/course-tags"
import { CourseYearComboboxSm } from "@/components/academics/home-page/combobox/course-year-sm"
import { CourseInstructorComboboxSm } from "@/components/academics/home-page/combobox/course-instructor-sm"
import { useFiltersStore } from "@/store/filters"
import { useResultsStore } from "@/store/results"

export function CourseFiltersCard({instructors}) {
    const [semester, setSemester] = React.useState("")
    const [filters, addFilter] = useFiltersStore((state: any) => [state.filters, state.addFilter])
    const [results, setResults] = useResultsStore((state: any) => [state.results, state.setResults])

    const handleSemester = (value: string) => {
        if (value === "None") {
            setSemester("")
        }
        else {
            setSemester(value)
        }
    }

    React.useEffect(() => {
        addFilter({ semester: semester })
    }
        , [semester])

    const handleSubmit = async () => {
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

    return (
        <Card className="w-[350px] border-r min-h-screen">
            <CardHeader>
                <CardTitle>Refine Your Search</CardTitle>
                <CardDescription>By choosing appropriate filters.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div>
                            <CourseTags type="filter" defaultTags={undefined} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="instructor">Instructor</Label>
                            <CourseInstructorComboboxSm instructors = {instructors}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="semester">Semester</Label>
                            <Select onValueChange={handleSemester}>
                                <SelectTrigger id="semester">
                                    <SelectValue placeholder="Select semester..." />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="None">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="year">Year</Label>
                            <CourseYearComboboxSm />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                {/* <Button variant="outline">Clear</Button> */}
                <Button onClick={handleSubmit}>Apply</Button>
            </CardFooter>
        </Card>
    )
}
