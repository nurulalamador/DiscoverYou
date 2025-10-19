const serverUrl = 'http://192.168.10.100:8000';
// const serverUrl = 'http://10.15.25.4:8000';

const categories = [
    "Music and Singing",
    "Robotics",
    "Literature",
    "Graphics Designing",
    "Web Development",
    "Dancing",
    "Competitive Programming",
    "Gaming",
    "App Development",
    "Arts and Crafts",
    "Debating",
    "Cooking",
    "Photography"
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

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let hours = date.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    let hour12 = hours % 12;
    if (hour12 === 0) hour12 = 12;

    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hour12}:${minutes} ${period}`;
}

function formatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";

    let hours = date.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    let hour12 = hours % 12;
    if (hour12 === 0) hour12 = 12;

    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hour12}:${minutes} ${period}`;
}

function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getCategoryIcon(category) {
    switch (category) {
        case "Music and Singing":
            return "music"; break;
        case "Graphics Designing":
            return "vector-square"; break;
        case "Web Development":
            return "code"; break;
        case "Literature":
            return "pen-to-square"; break;
        case "Competitive Programming":
            return "terminal"; break;
        case "Dancing":
            return "person-walking"; break;
        case "App Development":
            return "mobile-screen-button"; break;
        case "Arts and Crafts":
            return "palette"; break;
        case "Gaming":
            return "gamepad"; break;
        case "Debating":
            return "users-line"; break;
        case "Robotics":
            return "robot"; break;
        case "Cooking":
            return "utensils"; break;
        case "Photography":
            return "camera"; break;
        default:
            return "star"; break;
    }
}

export { serverUrl, getCategoryIcon, categories, formatDuration, timeAgo, formatDate, formatDateTime, formatTime};