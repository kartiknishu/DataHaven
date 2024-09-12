import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { useFiltersStore } from "@/store/filters";
import { useAddResourceStore } from "@/store/addResource";


export function CourseTags({ type, defaultTags }: { type: string, defaultTags: string[] }) {
    const [filters, setFilters, addFilter, clearFilters] = useFiltersStore((state: any) => [state.filters, state.setFilters, state.addFilter, state.removeFilter, state.clearFilters])
    const [resource, addResource] = useAddResourceStore((state: any) => [state.resource, state.addResource])
    const [assignments, setAssignments] = React.useState<boolean>(defaultTags ? defaultTags.includes('assignments') : false);
    const [books, setBooks] = React.useState<boolean>(defaultTags ? defaultTags.includes('books') : false);
    const [endterm, setEndterm] = React.useState<boolean>(defaultTags ? defaultTags.includes('endterm') : false);
    const [lectureSlides, setLectureSlides] = React.useState<boolean>(defaultTags ? defaultTags.includes('lectureSlides') : false);
    const [midterm, setMidterm] = React.useState<boolean>(defaultTags ? defaultTags.includes('midterm') : false);
    const [notes, setNotes] = React.useState<boolean>(defaultTags ? defaultTags.includes('notes') : false);
    const [programming, setProgramming] = React.useState<boolean>(defaultTags ? defaultTags.includes('programming') : false);
    const [quizzes, setQuizzes] = React.useState<boolean>(defaultTags ? defaultTags.includes('quizzes') : false);
    const [videoLectures, setVideoLectures] = React.useState<boolean>(defaultTags ? defaultTags.includes('videoLectures') : false);
    const [tutorials, setTutorials] = React.useState<boolean>(defaultTags ? defaultTags.includes('tutorials') : false);
    const [misc, setMisc] = React.useState<boolean>(defaultTags ? defaultTags.includes('misc') : false);

    React.useEffect(() => {
        let tags = defaultTags;
    }, [])

    React.useEffect(() => {
        let tags = []
        if (assignments) tags.push("assignments")
        if (books) tags.push("books")
        if (endterm) tags.push("endterm")
        if (lectureSlides) tags.push("lectureSlides")
        if (midterm) tags.push("midterm")
        if (notes) tags.push("notes")
        if (programming) tags.push("programming")
        if (quizzes) tags.push("quizzes")
        if (videoLectures) tags.push("videoLectures")
        if (tutorials) tags.push("tutorials")
        if (misc) tags.push("misc")

        if (type === "filter") {
            addFilter({ tags: tags });
        }
        else if (type === "add") {
            addResource({ tags: tags })
        }
    }, [assignments, books, endterm, lectureSlides, midterm, notes, programming, quizzes, videoLectures, tutorials, misc]);

    return (
        <>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Assignments
                    </p>
                </div>
                <Switch onCheckedChange={() => setAssignments(!assignments)} defaultChecked={assignments} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Books
                    </p>
                </div>
                <Switch onCheckedChange={() => setBooks(!books)} defaultChecked={books} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Endterm Assessments
                    </p>
                </div>
                <Switch onCheckedChange={() => setEndterm(!endterm)} defaultChecked={endterm} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Lecture Slides
                    </p>
                </div>
                <Switch onCheckedChange={() => setLectureSlides(!lectureSlides)} defaultChecked={lectureSlides} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Midterm Assessments
                    </p>
                </div>
                <Switch onCheckedChange={() => setMidterm(!midterm)} defaultChecked={midterm} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Notes
                    </p>
                </div>
                <Switch onCheckedChange={() => setNotes(!notes)} defaultChecked={notes} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Programming Assessments
                    </p>
                </div>
                <Switch onCheckedChange={() => setProgramming(!programming)} defaultChecked={programming} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Quizzes
                    </p>
                </div>
                <Switch onCheckedChange={() => setQuizzes(!quizzes)} defaultChecked={quizzes} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Video Lectures
                    </p>
                </div>
                <Switch onCheckedChange={() => setVideoLectures(!videoLectures)} defaultChecked={videoLectures} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Tutorials
                    </p>
                </div>
                <Switch onCheckedChange={() => setTutorials(!tutorials)} defaultChecked={tutorials} />
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Miscellaneous
                    </p>
                </div>
                <Switch onCheckedChange={() => setMisc(!misc)} defaultChecked={misc} />
            </div>
        </>
    )
}
