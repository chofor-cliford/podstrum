export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatLatestTime = (creationTime: number) => {
  // Check if creationTime is in microseconds or milliseconds
  const isMicroseconds = creationTime > 1e12; // A threshold to determine if it's in microseconds

  // Convert to total milliseconds if in microseconds
  const totalMilliseconds = isMicroseconds
    ? Math.floor(creationTime / 1000)
    : creationTime;

  // Create a Date object using the totalMilliseconds
  const date = new Date(totalMilliseconds);

  // Extract hours, minutes, and seconds
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // Format the time as H:MM:SS
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
};
