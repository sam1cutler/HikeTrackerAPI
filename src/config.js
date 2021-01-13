module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://samcutler@localhost/hike-tracker',
    DATABASE_TEST_URL: process.env.DATABASE_TEST_URL || 'postgresql://samcutler@localhost/hike-tracker-test',
}