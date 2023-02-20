import {
    Card,
    CardBody,
    Stack,
    Heading,
    Divider,
    CardFooter,
    Text,
    Avatar,
    Box,
    CardHeader,
    Flex,
    Center,
    useToast
} from '@chakra-ui/react';
import CommentList from '../Comments/CommentList';
import CommentArea from '../Components/CommentArea';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect, useState } from 'react';
import { CommentsContext } from '../Providers/CommentsContext';
import axios from 'axios';
import { ActiveCommentInterface, CommentInterface } from '../Common/common';
import { CustomSpinner } from '../Components/CustomSpinner';

export default function BlogPost() {

    const { comments, setComments } = useContext(CommentsContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeComment, setActiveComment] = useState<ActiveCommentInterface | null>(null);
    const toast = useToast();

    useEffect(() => {
        setIsLoading(true);
        axios.get<CommentInterface[]>('https://blog-post-comment-server.onrender.com/comment/getComments', { params: {} }).then((response) => {
            const allComments = response.data;
            setComments(allComments);
        }).catch((res) => {
            toast({
                description: 'Server error. Failed to fetch comments!',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
        }).finally(() => {
            setIsLoading(false);
        });
        // eslist-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getRootComments = () => {
        return comments.filter((comment) => comment.parentId === 0).sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    };

    const addComment = async (text: string, parentId: number) => {
        setIsLoading(true);
        axios
            .post('https://blog-post-comment-server.onrender.com/comment/insertComment', { commentBody: text, parentId, userId: 1, userName: 'Ganesh Vellaichamy' })
            .then((response) => {
                const insertComment = response.data;
                setComments([...comments, insertComment]);
                setActiveComment(null);
                toast({
                    description: 'Comment added successfully.',
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            })
            .catch((err) => {
                toast({
                    description: 'Failed to insert the comment.',
                    status: 'error',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const updateComment = async (text: string, parentId: number) => {
        setIsLoading(true);
        axios
            .post('https://blog-post-comment-server.onrender.com/comment/updateComment', { commentBody: text, commentId: parentId })
            .then((response) => {
                const updatedComment = response.data as CommentInterface;
                const updatedComments = comments.map((existingComment) => {
                    if (existingComment.commentId === parentId) {
                        return { ...existingComment, commentBody: text, updatedAt: updatedComment.updatedAt };
                    }
                    return existingComment;
                });
                setComments(updatedComments);
                setActiveComment(null);
                toast({
                    description: 'Comment updated successfully.',
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            })
            .catch((err) => {
                toast({
                    description: 'Failed to update the comment.',
                    status: 'error',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const deleteComment = async (commentId: number) => {
        setIsLoading(true);
        axios
            .post('https://blog-post-comment-server.onrender.com/comment/deleteComment', { commentId })
            .then(() => {
                const updatedComments = comments.filter(
                    (existingComment) => existingComment.commentId !== commentId
                );
                setComments(updatedComments);
                toast({
                    description: 'Comment deleted successfully.',
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            })
            .catch((err) => {
                toast({
                    description: 'Failed to delete the comment.',
                    status: 'error',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            }).finally(() => {
                setIsLoading(false);
            });
    };


    return (
        <>
            {isLoading && <CustomSpinner />}
            <Flex flexDirection="column">
                <Center><Heading size="lg">Welcome to blog post</Heading></Center>
                <Card margin={8}>
                    <CardHeader>
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <Avatar name="Ganesh Vellaichamy" src="https://bit.ly/sage-adebayo" />
                            <Box>
                                <Heading size="sm">Ganesh Vellaichamy</Heading>
                                <Text>Senior Software Engineer</Text>
                            </Box>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Stack mt="6" spacing="3">
                            <Heading size="md">Trending Technology</Heading>
                            <Text>
                                ChatGPT is an AI computer program that uses its intelligence to intake, comprehend and produce a response that
                                mimics the natural diction of human language.
                                <br />
                                The program uses a transformer-based neural network that works off of so much data that the AI can analyze that
                                information and create a response from it.
                                <br />
                                When a human user converses with ChatGPT, the AI processes the human text and generates the answer based on the data
                                it has access to.
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Box w='100%'>
                            <Box>
                                <Heading size="md">Write new comment:</Heading>
                            </Box>
                            <Box mb='4'>
                                <CommentArea submitLabel="Post" parentId={0} handleSubmit={addComment} hasCancelButton={false} handleCancel={() => { return true; }} />
                            </Box>
                            <Box>
                                <Heading size="md">Comments</Heading>
                            </Box>
                            <Box>
                                <CommentList key={uuidv4()} commentsArray={getRootComments()} commentLevel={1} addComment={addComment} updateComment={updateComment} deleteComment={deleteComment} activeComment={activeComment} setActiveComment={setActiveComment} />
                            </Box>
                        </Box>
                    </CardFooter>
                </Card>
            </Flex>
        </>
    );
}
