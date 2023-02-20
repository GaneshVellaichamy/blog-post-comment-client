import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { ActiveCommentInterface, CommentInterface } from '../Common/common';
import Comment from './Comment';
import { v4 as uuidv4 } from 'uuid';
import { CommentsContext } from '../Providers/CommentsContext';

export default function CommentList({
    commentsArray,
    commentLevel,
    addComment,
    updateComment,
    deleteComment,
    activeComment,
    setActiveComment,
}: {
    commentsArray: CommentInterface[];
    commentLevel: number;
    addComment: (text: string, parentId: number) => void;
    updateComment: (text: string, parentId: number) => void;
    deleteComment: (commentId: number) => void;
    activeComment: ActiveCommentInterface | null;
    setActiveComment: Dispatch<SetStateAction<ActiveCommentInterface | null>>;
}) {
    const { comments } = useContext(CommentsContext);

    const getReplyComments = (commentId: number) => {
        return comments.filter((comment) => comment.parentId === commentId).sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );;
    };

    return (
        <>
            {commentsArray.map((commentValue) => {
                return (
                    <>
                        <Comment
                            key={uuidv4()}
                            commentValue={commentValue}
                            commentLevel={commentLevel}
                            currentUserId={1}
                            getReplyComments={getReplyComments}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                            addComment={addComment}
                            updateComment={updateComment}
                            deleteComment={deleteComment}
                        />
                        {getReplyComments(commentValue.commentId).length > 0 && (
                            <CommentList key={uuidv4()} commentsArray={getReplyComments(commentValue.commentId)} commentLevel={commentLevel + 1} addComment={addComment} updateComment={updateComment}
                                deleteComment={deleteComment} activeComment={activeComment} setActiveComment={setActiveComment}/>
                        )}
                    </>
                );
            })}
        </>
    );
}
