
'use client';

import { useState } from 'react';
import { collection, query, orderBy, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { SectionTitle } from '../section-title';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StarRating } from '../star-rating';
import { ReviewForm } from '../review-form';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Trash2, Edit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

const ADMIN_EMAIL = "sheriffabdulraheemafunsho23@gmail.com";

const editReviewSchema = z.object({
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters.' }),
  rating: z.number().min(1, { message: 'Please provide a rating.' }).max(5),
});

function EditReviewForm({ review, onFormSubmit }: { review: any, onFormSubmit: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof editReviewSchema>>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      comment: review.comment,
      rating: review.rating,
    },
  });

  async function onSubmit(values: z.infer<typeof editReviewSchema>) {
    setIsSubmitting(true);
    try {
      if (!firestore) {
        throw new Error("Firestore is not initialized");
      }
      const reviewDocRef = doc(firestore, 'reviews', review.id);
      updateDocumentNonBlocking(reviewDocRef, values);
      toast({
        title: 'Review Updated!',
        description: 'Your review has been successfully updated.',
      });
      onFormSubmit();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was a problem updating your review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                <StarRating rating={field.value} onRatingChange={field.onChange} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Review'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function ReviewsSection() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const isAdmin = user?.email === ADMIN_EMAIL;

  const reviewsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'reviews');
  }, [firestore]);

  const reviewsQuery = useMemoFirebase(() => {
    if (!reviewsCollection) return null;
    return query(reviewsCollection, orderBy('createdAt', 'desc'));
  }, [reviewsCollection]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  const handleDeleteReview = (reviewId: string) => {
    if (!firestore) return;
    const reviewDocRef = doc(firestore, 'reviews', reviewId);
    deleteDocumentNonBlocking(reviewDocRef);
    toast({
      title: "Review Deleted",
      description: "The review has been successfully removed.",
    });
  };

  const handleVote = (reviewId: string, voteType: 'like' | 'dislike') => {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Not signed in",
            description: "You need to be signed in to vote.",
        });
        return;
    }

    const reviewDocRef = doc(firestore, 'reviews', reviewId);
    const review = reviews?.find(r => r.id === reviewId);
    if (!review) return;

    const userId = user.uid;
    const isLiked = review.likedBy?.includes(userId);
    const isDisliked = review.dislikedBy?.includes(userId);

    let updateData = {};

    if (voteType === 'like') {
        if (isLiked) {
            // User is unliking
            updateData = { likedBy: arrayRemove(userId) };
        } else {
            // User is liking, remove dislike if it exists
            updateData = { 
                likedBy: arrayUnion(userId),
                ...(isDisliked && { dislikedBy: arrayRemove(userId) })
            };
        }
    } else if (voteType === 'dislike') {
        if (isDisliked) {
            // User is undisliking
            updateData = { dislikedBy: arrayRemove(userId) };
        } else {
            // User is disliking, remove like if it exists
            updateData = { 
                dislikedBy: arrayUnion(userId),
                ...(isLiked && { likedBy: arrayRemove(userId) })
            };
        }
    }

    updateDocumentNonBlocking(reviewDocRef, updateData);
  };


  const isOwner = (reviewUserId: string) => user?.uid === reviewUserId;

  return (
    <section id="reviews" className="bg-background/30">
      <div className="container">
        <SectionTitle>Testimonials</SectionTitle>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold text-center lg:text-left">What people are saying</h3>
              {isLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-card/60 backdrop-blur-xl border-white/10 p-4">
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-5 w-28 mb-3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4 mt-1.5" />
                    </Card>
                  ))}
                </div>
              )}
              {!isLoading && reviews && (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const canModify = isAdmin || isOwner(review.userId);
                    const userHasLiked = user && review.likedBy?.includes(user.uid);
                    const userHasDisliked = user && review.dislikedBy?.includes(user.uid);

                    return (
                      <Card key={review.id} className="relative group bg-card/60 backdrop-blur-xl border-white/10 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm text-foreground">{review.authorName}</p>
                          <StarRating rating={review.rating} readOnly starSize={16} />
                        </div>
                        <p className="text-muted-foreground text-sm flex-grow">{review.comment}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex items-center gap-1" onClick={() => handleVote(review.id, 'like')}>
                                  <ThumbsUp className={cn("h-3.5 w-3.5", userHasLiked ? "text-blue-500 fill-blue-500" : "")} />
                                  <span className="text-xs">{review.likedBy?.length || 0}</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex items-center gap-1" onClick={() => handleVote(review.id, 'dislike')}>
                                  <ThumbsDown className={cn("h-3.5 w-3.5", userHasDisliked ? "text-red-500 fill-red-500" : "")} />
                                  <span className="text-xs">{review.dislikedBy?.length || 0}</span>
                              </Button>
                          </div>
                          {review.createdAt && (
                              <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                              </p>
                          )}
                        </div>

                        {canModify && (
                          <div className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Dialog open={openDialogs[review.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({ ...prev, [review.id]: isOpen }))}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Your Review</DialogTitle>
                                </DialogHeader>
                                <EditReviewForm review={review} onFormSubmit={() => setOpenDialogs(prev => ({ ...prev, [review.id]: false }))} />
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this review.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
              {!isLoading && reviews?.length === 0 && (
                <Card className="bg-card/60 backdrop-blur-xl border-white/10 p-6 text-center text-sm text-muted-foreground">
                  Be the first to leave a review!
                </Card>
              )}
            </div>
            <div>
              <Card className="bg-card/60 backdrop-blur-xl border-white/10 p-5 md:p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-headline font-semibold text-center lg:text-left">Leave a Review</CardTitle>
                </CardHeader>
                <ReviewForm />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
