import { HF_DATASET_LINK_BASE } from './constants';

export const isHFDatasetLinkValid = (link) => {
  return link.startsWith(HF_DATASET_LINK_BASE);
};

export const getRandomInitials = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomInitials = Array.from({ length: 2 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join(' ');
  return randomInitials;
};

export function calculateTimeDifference(startDate: Date, endDate: Date) {
  const diffInTime = endDate.valueOf() - startDate.valueOf();
  const diffInSeconds = Math.floor(diffInTime / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  return {
    diffInSeconds,
    diffInMinutes,
    diffInHours,
    diffInDays,
  };
}
