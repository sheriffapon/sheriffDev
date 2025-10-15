
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { SectionTitle } from '../section-title';
import { Card, CardContent } from '../ui/card';
import { StarRating } from '../star-rating';
import { ReviewForm } from '../review-form';
import { Skeleton } from '../ui/skeleton';

export function ReviewsSection() {
  const firestore = useFirestore();
  const reviewsCollection = useMemoFirebase(() => collection(firestore, 'reviews'), [firestore]);
  const reviewsQuery = useMemoFirebase(() => query(reviewsCollection, orderBy('createdAt', 'desc')), [reviewsCollection]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

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
                  <Card key={review.id} className="bg-card/60 backdrop-blur-xl border-white/10 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{review.authorName}</p>
                      <StarRating rating={review.rating} readOnly />
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
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
