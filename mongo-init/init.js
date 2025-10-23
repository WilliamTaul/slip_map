// script to inject the databases, admin users, and populated information into the Docker demo

db = db.getSiblingDB('taulkie_db');
db.createUser({
    user: "admin",  // Demo ONLY use secure credentials in production!
    pwd: "password",
    roles: [{ role: 'readWrite', db: "taulkie_db" }]
});

db.createCollection('userprofiles');
db.userprofiles.insertMany([
    // make userprofiles, use the ids to create users 
    {
    firstName: "John",
    lastName: "Smith",
    userId: "68f800238f67372bf0db551a",
    __v: 0
    },
    {
        firstName: "Emma",
        lastName: "Johnson",
        userId: "68f800238f67372bf0db551b",
        __v: 0
    },
    {
        firstName: "Michael",
        lastName: "Brown",
        userId: "68f800238f67372bf0db551c",
        __v: 0
    },
    {
        firstName: "Olivia",
        lastName: "Davis",
        userId: "68f800238f67372bf0db551d",
        __v: 0
    },
    {
        firstName: "David",
        lastName: "Miller",
        userId: "68f800238f67372bf0db551e",
        __v: 0
    },
    {
        firstName: "Sophia",
        lastName: "Wilson",
        userId: "68f800238f67372bf0db551f",
        __v: 0
    },
    {
        firstName: "Admin",
        lastName: "Star",
        userId: "68f800238f67372bf0db552a", 
        __v: 0
    }
]);
db.createCollection('messageboards');
db.messageboards.insertOne({
    _id: ObjectId("68f800238f67372bf0db524d"), // creating ID to match what is supplied in the .env files. this board will be used
                                               // as the default board users are inserted into
    title: 'Welcome',
    users: [ "68f800238f67372bf0db551a", "68f800238f67372bf0db551b", "68f800238f67372bf0db551c","68f800238f67372bf0db551d", "68f800238f67372bf0db551e", "68f800238f67372bf0db551f", "68f800238f67372bf0db552a"]
});

db = db.getSiblingDB('taulkie_auth');
db.createUser({
    user: "admin", // Demo ONLY use secure credentials in production!
    pwd: "password",
    roles: [{ role: 'readWrite', db: "taulkie_auth" }]
});
db.createCollection('users');
db.users.insertMany([
    // ids manually created to correspond to the above userprofiles
    // all user passwords will be set as 'password' (hashed/salt) for ease of use for demo just remember this is
    // NOT best practice in production
    // Also remember the point of salt is to ensure that even if two passwords
    // are the same they do not look the same. This is not the case here as they were manually
    // injected!
    {_id: ObjectId("68f800238f67372bf0db551a"), username: "john", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user"},
    { _id: ObjectId("68f800238f67372bf0db551b"), username: "emma", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user" },
    { _id: ObjectId("68f800238f67372bf0db551c"), username: "michael", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user" },
    { _id: ObjectId("68f800238f67372bf0db551d"), username: "olivia", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user" },
    { _id: ObjectId("68f800238f67372bf0db551e"), username: "david", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user" },
    { _id: ObjectId("68f800238f67372bf0db551f"), username: "sophia", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "user" },
    { _id: ObjectId("68f800238f67372bf0db552a"), username: "admin", password: "$2b$10$5OqPNB1g2N22R/IOUEZsvOvwL3eYBcEQAcgV98WLSGCd/DDcmPW3S", role: "admin" },
]);
