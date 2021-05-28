const users = [];

// Join user to chat
function userJoin(id, username, town) {
    const user = { id, username, town };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getTownUsers(town) {
    return users.filter(user => user.town === town);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getTownUsers
};