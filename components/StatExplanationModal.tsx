import { CircleQuestionMark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type StatExplanationModalProps = {
  title: string;
  description: string;
};

export default function StatExplanationModal({
  title,
  description,
}: StatExplanationModalProps) {
  return (
    <Dialog>
      <DialogTrigger className='cursor-pointer'>
        <div className='text-sm text-gray-600 hover:text-gray-800 transition-colors '>
          <CircleQuestionMark className='size-4' />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-left'>{title}</DialogTitle>
          <DialogDescription className='mt-4 text-left'>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
