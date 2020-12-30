const generateHint = (word) => {
    return word.replace(/\w/g, '_');
}

module.exports = generateHint;