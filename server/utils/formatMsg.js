function formatMsg(color, text, admin = true, user = 'Null') {
    return {
        admin,
        color,
        text,
        user
    };
}

module.exports = formatMsg;