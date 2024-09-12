import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import axios from "axios"
import * as React from "react"
axios.defaults.withCredentials = true
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAddResourceStore } from "@/store/addResource"
import { CourseTags } from "@/components/academics/home-page/course-tags"
import { CourseCodeCombobox } from "@/components/academics/home-page/combobox/course-code"
import { CourseYearCombobox } from "@/components/academics/home-page/combobox/course-year"
import { CourseTitleCombobox } from "@/components/academics/home-page/combobox/course-title"
import { CourseInstructorCombobox } from "@/components/academics/home-page/combobox/course-instructor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function ContributeAlert({ label, variant, resourceId, isUpdate, codes, titles, instructors, codeTitleMap }: { label: string, variant: any, resourceId: string, isUpdate: boolean, codes: Array<any>,titles: Array<any>, instructors: Array<any>, codeTitleMap: { [key: string]: string }}) {
    const [semester, setSemester] = React.useState<string>("")
    const [driveLink, setDriveLink] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [resourceData, setResourceData] = React.useState({ courseCode: '', courseTitle: '', courseInstructor: '', courseSecondaryInstructor: '', year: '' });
    const [tags, setTags] = React.useState<string[]>([]);
    const [error, setError] = React.useState(false);
    const [resource, addResource, clearResource] = useAddResourceStore((state: any) => [state.resource, state.addResource, state.clearResource])

    React.useEffect(() => {
        if (resourceId.length !== 0) {
            const getInfo = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`${process.env.BACKEND_URL}/api/v1/resource/${resourceId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                    })
                    const data = response.data.resource
                    setResourceData({
                        courseCode: data.courseCode, courseTitle: data.courseTitle, courseInstructor: data.instructor_primary
                        , courseSecondaryInstructor: data.instructor_secondary, year: data.year
                    })
                    setTags(data.tags);
                    setSemester(data.semester)
                    setDriveLink(data.link)
                    setDescription(data.description)
                } catch (err) {
                    console.log(err);
                }
            }
            getInfo();
        }
    }, [resourceId])

    React.useEffect(() => {
        addResource({ semester: semester })
    }
        , [semester])

    React.useEffect(() => {
        addResource({ description: description })
    }
        , [description])

    React.useEffect(() => {
        addResource({ link: driveLink })
    }
        , [driveLink])

    const handleSemester = (value: string) => {
        if (value === "None") {
            setSemester("")
        }
        else {
            setSemester(value)
        }
    }

    const handleDescription = (e: any) => {
        e.preventDefault()
        setDescription(e.target.value)
    }

    const handleDriveLink = (e: any) => {
        e.preventDefault()
        setDriveLink(e.target.value)
    }

    const handleSubmit = async () => {
        try {
            const resourceData = resource
            console.log(resourceData)
            const token = localStorage.getItem('authToken');

            if (label === 'Edit') {
                const response = await axios.put(`${process.env.BACKEND_URL}/api/v1/resource/update/${resourceId}`, resourceData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                window.location.reload();
            } else {
                const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/resource/add`, resourceData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            if (isUpdate == false) {
                toast.success("Resource Added Successfully!", {
                    description: "Thank you for contributing!",
                })
            }

            setDriveLink("")
            setDescription("")
            clearResource()
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        if (resourceId.length === 0) {
            setSemester('');
            setDriveLink('');
            setDescription('');
        }
        setError(false);
    }

    const checkError = () => {
        const resourceData = resource
        if (resourceData.courseCode.length === 0 || resourceData.courseTitle.length === 0 || resourceData.instructor_primary.length === 0 || resourceData.semester.length === 0 || resourceData.year.length === 0 || resourceData.link.length === 0) {
            setError(true);
            setTimeout(() => setError(false), 5000);
        }
    }


    return (
        // <div className="w-full h-full bg-pink-300">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex justify-center">
                    <Button variant={variant} className="w-[80%]">{label}</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add a new resource</AlertDialogTitle>
                    <ScrollArea className="h-[500px] px-4 py-4">
                        {error && <AlertDialogDescription className='mb-2'>"Please complete all the required fields"</AlertDialogDescription>}
                        <AlertDialogDescription>
                            <form>
                                <div className="grid w-full items-center gap-4 text-foreground px-1">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="course-code">Course Code <span>*</span></Label>
                                        <CourseCodeCombobox defaultValue={resourceData.courseCode} codes = {codes}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="course-title">Course Title <span>*</span></Label>
                                        <CourseTitleCombobox defaultValue={resourceData.courseTitle} titles = {titles} codeTitleMap = {codeTitleMap}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="primary-instructor">Primary Instructor <span>*</span></Label>
                                        <CourseInstructorCombobox type="primary" defaultValue={resourceData.courseInstructor} instructors = {instructors}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="secondary-instructor">Secondary Instructor (If applicable)</Label>
                                        <CourseInstructorCombobox type="secondary" defaultValue={resourceData.courseSecondaryInstructor} instructors = {instructors}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="semester">Semester <span>*</span></Label>
                                        <Select onValueChange={handleSemester} defaultValue={semester}>
                                            <SelectTrigger id="semester">
                                                <SelectValue placeholder="Select semester..." />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="year">Year <span>*</span></Label>
                                        <CourseYearCombobox defaultValue={resourceData.year} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <div>Tags</div>
                                        <div className="border rounded-lg">
                                            <CourseTags type="add" defaultTags={tags} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea onChange={handleDescription} value={description} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5 mb-2">
                                        <Label htmlFor="link">Link <span>*</span></Label>
                                        <Textarea onChange={handleDriveLink} value={driveLink} />
                                    </div>
                                </div>
                            </form>
                        </AlertDialogDescription>
                    </ScrollArea>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    {error && <AlertDialogAction onClick={handleSubmit} disabled >Upload</AlertDialogAction>}
                    {!error && <AlertDialogAction onClick={handleSubmit} onKeyDown={checkError} onPointerDown={checkError} >Upload</AlertDialogAction>}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        // </div>
    )
}
