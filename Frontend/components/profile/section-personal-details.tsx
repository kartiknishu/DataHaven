'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SectionPersonalDetails({ personalInfo, rank }) {
    return (
        <div className="flex justify-center">
            <div className="w-[95%] border-b py-8 px-2 flex justify-between">
                <div className="flex">
                    <div className="px-3">
                        <Avatar className="h-28 w-28">
                            <AvatarImage src={personalInfo.imageUrl ? personalInfo.imageUrl : "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="px-2 pt-4 text-2xl font-bold">{personalInfo?.name}</div>
                        <div className="px-2 text-lg text-muted-foreground capitalize">Batch of {personalInfo?.year}</div>
                        <div className="px-2 text-xs text-muted-foreground">{personalInfo?.rating} Upvotes</div>
                    </div>
                </div>
                <div className="flex px-5">
                    <div className="w-28 h-28 border rounded bg-secondary mr-4">
                        <div className="text-xs text-center py-2 font-bold">Contributions</div>
                        <div className="text-6xl text-center text-muted-foreground font-bold">{personalInfo?.contributedResources?.length}</div>
                    </div>
                    <div className="w-28 h-28 border rounded bg-secondary">
                        <div className="text-xs text-center py-1 font-bold">Leaderboard <br /> Rank</div>
                        <div className="text-6xl text-center text-muted-foreground font-bold">{rank}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
