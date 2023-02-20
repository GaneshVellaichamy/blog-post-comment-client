import {
    Avatar,
    Box,
    Button,
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { ActiveCommentInterface, CommentInterface } from '../Common/common';
import CommentArea from '../Components/CommentArea';

const activeCommentEditType = 1;
const activeCommentReplyType = 2;

export default function Comment({
    commentValue,
    commentLevel,
    currentUserId,
    getReplyComments,
    activeComment,
    setActiveComment,
    addComment,
    updateComment,
    deleteComment,
}: {
    commentValue: CommentInterface;
    commentLevel: number;
    currentUserId: number;
    getReplyComments: (commentId: number) => CommentInterface[];
    activeComment: null | ActiveCommentInterface;
    setActiveComment: Dispatch<SetStateAction<ActiveCommentInterface | null>>;
    addComment: (text: string, parentId: number) => void;
    updateComment: (text: string, commentId: number) => void;
    deleteComment: (commentId: number) => void;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getMarginLeft = () => {
        return commentLevel * 4;
    };

    const getReplyCount = (commentId: number) => {
        const replyComments = getReplyComments(commentId);
        return replyComments.length;
    };

    const isEditing =
        activeComment && activeComment.commentId === commentValue.commentId && activeComment.type === activeCommentEditType;
    const isReplying =
        activeComment && activeComment.commentId === commentValue.commentId && activeComment.type === activeCommentReplyType;
    const canEdit = currentUserId === commentValue.userId && getReplyCount(commentValue.commentId) === 0;
    const canDelete = currentUserId === commentValue.userId && getReplyCount(commentValue.commentId) === 0;

    return (
        <>
            <Flex>
                <Flex marginLeft={getMarginLeft()} alignItems="center" my={1}>
                    <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                    <Flex flexDirection="column">
                        <Flex>
                            <Text marginLeft={2}>{commentValue.userName}</Text>
                            <Text marginLeft={2}>{moment(commentValue.updatedAt).format('YYYY-MM-DD h:mm:ss')}</Text>
                        </Flex>
                        <Flex>
                        {!isEditing && <Text marginLeft={2}>{commentValue.commentBody}</Text>}
                        </Flex>
                        <Flex>
                            <Link ml="2" onClick={() => setActiveComment({ commentId: commentValue.commentId, type: activeCommentReplyType })} color='blue.500' fontSize='sm'>
                                Reply
                            </Link>
                            {canEdit && (
                                <Link ml="2" onClick={() => setActiveComment({ commentId: commentValue.commentId, type: activeCommentEditType })} color='blue.500' fontSize='sm'>
                                    Edit
                                </Link>
                            )}
                            {canDelete && (
                                <Link ml="2" onClick={() => onOpen()} color='blue.500' fontSize='sm'>
                                    Delete
                                </Link>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Box width='100%'>
                {isReplying && (
                    <CommentArea
                        submitLabel="Reply"
                        handleSubmit={addComment}
                        parentId={commentValue.commentId}
                        hasCancelButton={true}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                {isEditing && (
                    <CommentArea
                        submitLabel="Update"
                        hasCancelButton={true}
                        initialText={commentValue.commentBody}
                        handleSubmit={updateComment}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                        parentId={commentValue.commentId}
                    />
                )}
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to delete comment?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="gray.700"
                            borderColor="gray.200"
                            bgColor="white"
                            borderWidth={1}
                            fontFamily="Inter"
                            fontSize="md"
                            fontWeight="600"
                            onClick={() => onClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            bgColor="red.500"
                            color="white"
                            fontFamily="Inter"
                            fontSize="md"
                            fontWeight="600"
                            onClick={() => deleteComment(commentValue.commentId)}
                            ml='2'
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
