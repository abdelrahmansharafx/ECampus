// Format distance to readable string
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

// Format time in minutes to readable string
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};

// Format date to readable string
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time to readable string
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date and time
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

// Round to decimal places
export const roundTo = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Get status color based on ride status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#16A34A'; // COLORS.success
    case 'in-progress':
      return '#3A3A3A'; // COLORS.primary
    case 'cancelled':
      return '#DC2626'; // COLORS.danger
    default:
      return '#64748B'; // COLORS.secondary
  }
};

export default {
  formatDistance,
  formatDuration,
  formatDate,
  formatTime,
  formatDateTime,
  roundTo,
  getStatusColor,
};
