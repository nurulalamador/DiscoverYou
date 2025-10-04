// const serverUrl = 'http://192.168.10.100:8000';
const serverUrl = 'http://10.15.4.21:8000';

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
        default: 
            return "gamepad"; break;
    }
}

export { serverUrl, getCategoryIcon };