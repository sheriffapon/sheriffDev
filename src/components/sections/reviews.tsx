
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { SectionTitle } from '../section-title';
import { Card, CardContent } from '../ui/card';
import { StarRating } from '../star-rating';
import { ReviewForm } from '../review-form';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

// IMPORTANT: Replace this with your actual admin email
const ADMIN_EMAIL = "sheriffabdulraheemafunsho23@gmail.com";

export function ReviewsSection() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const isAdmin = user?.email === ADMIN_EMAIL;

  const reviewsCollection = useMemoFirebase(() => collection(firestore, 'reviews'), [firestore]);
  const reviewsQuery = useMemoFirebase(() => query(reviewsCollection, orderBy('createdAt', 'desc')), [reviewsCollection]);

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

  return (
    <section id="reviews" className="bg-background/30">
      <div className="container">
        <SectionTitle>Testimonials</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-2xl font-headline font-semibold text-center lg:text-left">What people are saying</h3>
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="bg-card/60 backdrop-blur-xl border-white/10 p-6">
                    <div className="flex items-center mb-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && reviews && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="relative group bg-card/60 backdrop-blur-xl border-white/10 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{review.authorName}</p>
                      <StarRating rating={review.rating} readOnly />
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    {review.createdAt && (
                      <p className="text-xs text-muted-foreground mt-4">
                        {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    )}
                    {isAdmin && (
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                    )}
                  </Card>
                ))}
              </div>
            )}
             {!isLoading && reviews?.length === 0 && (
                <Card className="bg-card/60 backdrop-blur-xl border-white/10 p-6 text-center text-muted-foreground">
                    Be the first to leave a review!
                </Card>
             )}
          </div>
          <div>
            <Card className="bg-card/60 backdrop-blur-xl border-white/10 p-6 md:p-8">
              <h3 className="text-2xl font-headline font-semibold mb-4 text-center lg:text-left">Leave a Review</h3>
              <ReviewForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
