export type CommentInterface = {
    commentId: number;
    commentBody: string;
    parentId: number;
    userId: number;
    userName: string;
    createdAt: string;
    updatedAt: string;
};

export type ActiveCommentInterface = {
    commentId: number;
    type: number;
};