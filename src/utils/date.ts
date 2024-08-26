import { formatDistanceToNow } from 'date-fns';

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}