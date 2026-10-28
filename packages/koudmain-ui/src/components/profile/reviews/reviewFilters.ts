import { IProfileReview } from '../../../types/profile';

export type ReviewSort = 'recent' | 'oldest' | 'best' | 'worst';

export interface ReviewFilters {
  ratings: number[];
  withCommentOnly: boolean;
  sort: ReviewSort;
}

export const defaultReviewFilters: ReviewFilters = {
  ratings: [],
  withCommentOnly: false,
  sort: 'recent',
};

export const REVIEW_SORT_LABELS: Record<ReviewSort, string> = {
  recent: 'plus récent',
  oldest: 'plus ancien',
  best: 'meilleure note',
  worst: 'moins bonne note',
};

export function countActiveReviewFilters(filters: ReviewFilters) {
  return (
    Number(filters.ratings.length > 0) +
    Number(filters.withCommentOnly) +
    Number(filters.sort !== defaultReviewFilters.sort)
  );
}

export function applyReviewFilters(reviews: IProfileReview[], filters: ReviewFilters) {
  const filtered = reviews.filter(
    (review) =>
      (filters.ratings.length === 0 || filters.ratings.includes(review.rating)) &&
      (!filters.withCommentOnly || !!review.comment?.trim()),
  );

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'best':
        return b.rating - a.rating;
      case 'worst':
        return a.rating - b.rating;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}
