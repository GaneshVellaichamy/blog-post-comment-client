import { Box, Button, Textarea } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';

export default function CommentArea({
  handleSubmit,
  submitLabel,
  parentId,
  hasCancelButton = false,
  handleCancel,
  initialText,
}: {
  handleSubmit: (commentText: string, parentId: number) => void;
  submitLabel: string;
  parentId: number;
  hasCancelButton: boolean;
  handleCancel: () => void;
  initialText?: string;
}) {
  const [text, setText] = useState(initialText ? initialText : '');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSubmit(text, parentId);
    setText('');
  };

  return (
    <Box>
      <Box>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} w="100%" height="50px" my="4" />
      </Box>
      <Box>
        <Button isDisabled={text.length === 0} bgColor="blue.500" color="white" fontFamily="Inter" fontSize="md" fontWeight="600" onClick={(e) => onSubmit(e)}>
          {submitLabel}
        </Button>
        {hasCancelButton && (
          <Button
            onClick={() => handleCancel()}
            color="gray.700"
            borderColor="gray.200"
            fontFamily="Inter"
            fontSize="md"
            fontWeight="600"
            ml='2'
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
