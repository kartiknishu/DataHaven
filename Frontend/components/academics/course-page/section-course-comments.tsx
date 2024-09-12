'use client';

import axios from 'axios';
import moment from 'moment';
axios.defaults.withCredentials = true;
import { IoSend } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { BsReplyFill } from 'react-icons/bs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

type Comment = {
    _id: string;
    imageUrl: string;
    author: string;
    text: string;
    likedBy: string[];
    dislikedBy: string[];
    createdAt: any;
    parent: { author: string, _id: string }
};

type User = {
    name: string,
    _id: string,
}

interface framework {
    comments: Comment[];
    user: User;
    handleDelete: (id: any) => void;
    handleReply: (comment: Comment) => void;
    allComments: Comment[];
    id: any
}

export function SectionCourseComments({ commentsInfo, courseInfo, user }: { commentsInfo: Comment[], courseInfo: any, user: User }) {

    const [commentValue, setCommentValue] = useState('');
    const [currentComments, setCurrentComments] = useState<Comment[]>(commentsInfo);
    const [allComments, setAllComments] = useState<Comment[]>(commentsInfo);
    const [replying, setReplying] = useState<string>('');

    useEffect(() => {
        setAllComments(commentsInfo);
        setCurrentComments(commentsInfo);
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('authToken')
            if (replying.length !== 0) {
                const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/comment/create`, { text: commentValue, course_id: courseInfo._id, parent: replying }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setReplying('');
            } else {
                const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/comment/create`, { text: commentValue, course_id: courseInfo._id }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
            const updatedCommentsRes = await axios.get(`${process.env.BACKEND_URL}/api/v1/comment/resource/${courseInfo._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setAllComments(updatedCommentsRes.data.comments);
            setCommentValue('')
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const filteredComments = allComments.filter((c: Comment) => !c.parent || !c.parent._id || c.parent._id.length === 0)
        const sortedComments = filteredComments.sort((a: any, b: any) => {
            const timeA = new Date(a.createdAt)
            const timeB = new Date(b.createdAt)
            return timeB.getTime() - timeA.getTime()

        })

        setCurrentComments(sortedComments);
    }, [allComments])

    const getReplies = (commentId: string) => {
        return allComments.filter(comment => comment.parent._id === commentId);
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`${process.env.BACKEND_URL}/api/v1/comment/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            setAllComments(allComments.filter(comment => comment._id !== id))
        } catch (err: any) {
            console.log(err.message)

        }
    }

    const handleReply = (comment: Comment) => {
        setCommentValue(`@ ${comment.author} `);
        setReplying(comment._id);
    }


    const handleInputChange = (e: any) => {
        setCommentValue(e.target.value);
    }

    return (
        <div className="w-[70%] py-8 pl-14 pr-5">
            <div className="text-2xl font-bold px-2">Comments</div>
            <div className="w-full h-[500px] border rounded my-2">
                <div className="w-full h-[85%] border-b">
                    <ScrollArea className="h-full">
                        {currentComments.map((comment: Comment, index: number) => (<>
                            <div key={index} className="flex justify-between items-center py-2 px-4 border-b bg-white hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50">
                                <div className="flex space-x-2">
                                    <Avatar>
                                        <AvatarImage src={comment.imageUrl ? comment.imageUrl : "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{comment.text}</p>
                                        <p className="text-muted-foreground mt-2">{comment.author} <span className='mx-3 italic text-gray-400'>  {moment(comment.createdAt).fromNow()}</span></p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Button variant="outline" className="mx-1" onClick={() => handleReply(comment)}>
                                        <BsReplyFill size={18} />
                                    </Button>
                                    {user.name == comment.author && <Button variant="outline" className="mx-1" onClick={() => handleDelete(comment._id)}>
                                        <MdDelete size={18} />
                                    </Button>}
                                </div>
                            </div>
                            <CommentReplies comments={allComments.filter(comnt => comnt.parent && comnt.parent._id === comment._id)} user={user} handleDelete={handleDelete} allComments={allComments} handleReply={handleReply} />
                        </>
                        ))}
                    </ScrollArea>
                </div>
                <div className="flex justify-between items-center h-[15%]">
                    <div className="px-4 w-full">
                        <Input type="text" placeholder="Add comment..." value={commentValue} onChange={handleInputChange} />
                    </div>
                    <Button variant="ghost" className="m-1 mx-4" onClick={handleSubmit}>
                        <IoSend size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

const CommentReplies = ({ comments, user, handleDelete, allComments, handleReply }: { comments: any, user: { name: string, _id: string }, handleDelete: (id: string) => void, allComments: Comment[], handleReply: (comment: Comment) => void }) => {

    return (
        <ScrollArea className="h-full">
            {comments.map((comment: any, index: number) => (<>
                <div key={index} className="flex justify-between items-center py-2 px-4 border-b bg-white hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50">
                    <div className="flex space-x-2">
                        <Avatar>
                            <AvatarImage src={comment.imageUrl ? comment.imageUrl : "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='italic font-light text-gray-200 text-xs'>To {comment.parent.author} from {comment.author === user.name ? 'You' : comment.author}</p>
                            <p className="font-semibold mt-2">{comment.text}</p>
                            <p className="text-muted-foreground mt-2">{comment.author}<span className='mx-3 italic text-gray-400'>  {moment(comment.createdAt).fromNow()}</span></p>
                        </div>
                    </div>
                    <div className="space-y-1" >
                        <Button variant="outline" className="mx-1" onClick={() => handleReply(comment)}>
                            <BsReplyFill size={18} />
                        </Button>
                        {user.name == comment.author && <Button variant="outline" className="mx-1" onClick={() => handleDelete(comment._id)}>
                            <MdDelete size={18} />
                        </Button>}
                    </div>
                </div>
                <CommentReplies comments={allComments.filter(comnt => comnt.parent && comnt.parent._id === comment._id)} user={user} handleDelete={handleDelete} allComments={allComments} handleReply={handleReply} />
            </>
            ))}
        </ScrollArea>
    )
}
