'use client';

import { Badge } from '@/components/ui/badge';

export function SectionCourseMetadata({ courseInfo, uploader }) {
    return (
        <div className="w-[20%] border-r p-3">
            <div className="py-2 rounded">
                Contributed by <span>{uploader}</span>
                {/* <br /> <span className="text-xs text-muted-foreground">Batch of {courseInfo.batch}</span> */}
            </div>
            <div className="py-2">
                <div>Description</div>
                <div className="text-muted-foreground text-xs">
                    {courseInfo?.description}
                </div>
            </div>
            <div className="py-2">
                <div>Tags</div>
                <div>
                    {courseInfo && courseInfo.tags && courseInfo.tags.map((tag, index) => (
                        index % 2 == 0 ? (
                            <>
                                <Badge variant="default" className="m-0.5">#{tag}</Badge>
                            </>
                        ) : (
                            <>
                                <Badge variant="secondary" className="m-0.5">#{tag}</Badge>
                            </>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
