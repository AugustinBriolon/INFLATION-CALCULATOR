import { CircleQuestionMark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type SimpleModalProps = {
  title: string;
  description: string;
};

export default function SimpleModal({
  title,
  description,
}: SimpleModalProps) {
  return (
    <Dialog>
      <DialogTrigger className='cursor-pointer'>
        <div className='text-sm text-gray-600 hover:text-gray-800 transition-colors '>
          <CircleQuestionMark className='size-4' />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-left text-xl font-bold'>{title}</DialogTitle>
          <DialogDescription className='mt-4 text-left text-sm'>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
