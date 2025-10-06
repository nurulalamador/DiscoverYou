const serverUrl = 'http://192.168.10.100:8000';
// const serverUrl = 'http://10.15.4.21:8000';
// const serverUrl = 'http://10.15.29.132:8000';

const categories = [
    "Music and Singing",
    "Graphics Designing",
    "Web Development",
    "Literature",
    "Competitive Programming",
    "Dancing",
    "App Development",
    "Arts and Crafts",
    "Gaming",
    "Robotics",
    "Debating"
];

function timeAgo(isoDate) {
  const now = new Date();
  const past = new Date(isoDate);

  const diff = now.getTime() - past.getTime(); // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getCategoryIcon(category) {
    switch(category) {
        case "Music and Singing": 
            return "music"; break;
        case "Graphics Designing": 
            return "vector-square"; break;
        case "Web Development": 
            return "code"; break;
        case "Literature": 
            return "pen-to-square"; break;
        case "Competitive Programming": 
            return "code"; break;
        case "Dancing": 
            return "person-walking"; break;
        case "App Development": 
            return "code"; break;
        case "Arts and Crafts": 
            return "palette"; break;
        case "Gaming": 
            return "gamepad"; break;
        case "Debating": 
            return "users-line"; break;
        case "Robotics": 
            return "robot"; break;
        default: 
            return "star"; break;
    }
}

export { serverUrl, getCategoryIcon, categories, formatDuration, timeAgo };