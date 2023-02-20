import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react";
import { CommentInterface } from "../Common/common";

export interface CommentsContextValue {
    comments: CommentInterface[];
    setComments: Dispatch<SetStateAction<CommentInterface[]>>;
}

export const CommentsContext = createContext({} as CommentsContextValue);

export function CommentsContextProvider({ children }: { children: React.ReactNode }) {
    const [comments, setComments] = useState<CommentInterface[]>([]);

    const CommentsContextValue = useMemo(() => ({
        comments,
        setComments,
    }), [comments])

    return <CommentsContext.Provider value={CommentsContextValue}>{children}</CommentsContext.Provider>;
}