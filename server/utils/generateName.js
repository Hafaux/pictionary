const adjectives = ["New", "Good", "High", "Old", "Great", "Big", "American", "Small", "Large", "National", "Young", "Different", "Black", "Long", "Little", "Important", "Political", "Bad", "Real", "Social", "Only", "Public", "Low", "Early", "Able", "Human", "Local", "Late", "Hard", "Major", "Better", "Economic", "Strong", "Possible", "Whole", "Free", "Military", "True", "Special", "Clear", "Recent", "Certain", "Personal", "Open", "Red", "Difficult", "Available", "Likely", "Short", "Single", "Medical", "Current", "Wrong", "Private", "Past", "Foreign", "Fine", "Common", "Poor", "Natural", "Significant", "Similar", "Hot", "Dead", "Central", "Happy", "Serious", "Ready", "Simple", "Left", "Physical", "General", "Environmental", "Financial", "Blue", "Democratic", "Dark", "Various", "Entire", "Close", "Religious", "Cold", "Final", "Main", "Green", "Nice", "Huge", "Popular", "Traditional", "Cultural"];

const animals = ["Alligator", "Alpaca", "Angler fish", "Ant", "Anteater", "Antelope", "Armadillo", "Bald eagle", "Barn owl", "Bat", "Bearded dragon", "Beaver", "Bee", "Beetle", "Bigfoot", "Bird", "Bison", "Boar", "Brontosaurus", "Bull", "Bulldog", "Butterfly", "Camel", "Cat", "Caterpillar", "Catfish", "Centipede", "Chameleon", "Cheetah", "Chicken", "Chicken turtle", "Chihuahua", "Clown fish", "Cobra", "Cockroach", "Cow", "Crab", "Crocodile", "Crow", "Dalmatian", "Deer", "Dinosaur", "Dog", "Dolphin", "Donkey", "Dragon", "Dragonfly", "Duck", "Eagle", "Eel", "Elephant", "Firefly", "Flamingo", "Flea", "Fly", "Flying fox", "Fox", "Frog", "Gazelle", "Gecko", "Giant anteater", "Giant panda", "Giant tortoise", "Giraffe", "Goat", "Golden hamster", "Goldfish", "Goose", "Grasshopper", "Hammerhead shark", "Hamster", "Hedgehog", "Hen", "Hippo", "Horse", "Hummingbird", "Hyena", "Jaguar", "Jellyfish", "Kangaroo", "Killer whale", "King crab", "King kong", "King penguin", "King vulture", "Kitten", "Koala", "Kraken", "Lamb", "Leech", "Lemur", "Leopard", "Lion", "Lizard", "Llama", "Loch ness monster", "Lynx", "Maggot", "Mammoth", "Mantis"]

const generateName = () => {
    return adjectives[randomIndex(adjectives)] + ' ' +
           animals[randomIndex(animals)];
}

function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

module.exports = generateName;