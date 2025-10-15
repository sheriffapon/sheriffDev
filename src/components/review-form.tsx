'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { StarRating } from './star-rating';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';

const formSchema = z.object({
  authorName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters.' }),
  rating: z.number().min(1, { message: 'Please provide a rating.' }).max(5),
});

export function ReviewForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorName: '',
      comment: '',
      rating: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be signed in to leave a review. Please refresh the page and try again.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewsCollection = collection(firestore, 'reviews');
      await addDocumentNonBlocking(reviewsCollection, {
        ...values,
        createdAt: serverTimestamp(),
        userId: user.uid, // Associate review with the anonymous user
      });

      toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem submitting your review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isButtonDisabled = isSubmitting || isUserLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="example.name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What did you think of my portfolio?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="rating"
          render={({ field, fieldState }) => (
             <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                    <StarRating
                    rating={field.value}
                    onRatingChange={field.onChange}
                    />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isButtonDisabled}>
          {isSubmitting ? 'Submitting...' : isUserLoading ? 'Initializing...' : <>Submit Review <Send className="ml-2 h-4 w-4" /></>}
        </Button>
      </form>
    </Form>
  );
}
