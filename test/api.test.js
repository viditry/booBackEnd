const supertest = require('supertest');
const should = require('should');
const async = require('async'); // Make sure to install the async package
const { app, startServer, getServer } = require('../index.js'); // Update the path accordingly
const request = supertest(app);

describe('API Tests', function () {
    let userId;
    let commentIds = []; // Array to hold the IDs of the created comments
    let server;

    // Combined `before` hook
    before(async function () {
        this.timeout(10000); // Optionally increase timeout if necessary
        await startServer();
        server = getServer();
        // Create a new user
        const userResponse = await request.post('/users').send({
            name: "test",
            age: 24,
            bio: "Female",
            image: ""
        }).expect(201);

        userId = userResponse.body._id;

        // Create comments and store their IDs
        const commentsToCreate = [
            { content: "This is comment 1", author: userId, personalityTags: ["INFJ"] },
            { content: "This is comment 2", author: userId, personalityTags: ["ENFJ"] },
            { content: "This is comment 3", author: userId, personalityTags: ["INTJ"] }
        ];

        for (let comment of commentsToCreate) {
            const commentResponse = await request.post('/comments').send(comment).expect(201);
            commentIds.push(commentResponse.body._id);
        }
    });

    it('should get a user by ID', function (done) {
        // Use the stored `userId` from the `before` hook
        request.get(`/users/${userId}`)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.property('_id', userId);
                done();
            });
    });
    it('should get comments sorted by recent', function (done) {
        request.get('/comments?sortBy=recent')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                // Check if the comments are sorted by createdAt in descending order
                const isSortedByRecent = res.body.every(function (val, i, arr) {
                    return i === 0 || new Date(val.createdAt) <= new Date(arr[i - 1].createdAt);
                });

                isSortedByRecent.should.be.true();
                done();
            });
    });
    it('should "unlike" a comment by ID', function (done) {
        const commentToUnlike = commentIds[1]; // Use the same ID to unlike
        request.patch(`/comments/${commentToUnlike}/unlike`)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                // Verify that the number of likes has decreased
                // This is highly dependent on your API response structure
                done();
            });
    });


    it('should get comments', function (done) {
        request.get('/comments')
            .expect(200) // Expect HTTP status code 200 OK
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.be.an.instanceOf(Array);
                done();
            });
    });


    it('should return comments sorted by best', function (done) {
        request.get('/comments?sortBy=best')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                // Assuming your comments have a like count in `likes`
                const sortedByBest = res.body.every((val, i, arr) => !i || (val.likes >= arr[i - 1].likes));
                sortedByBest.should.be.true();
                done();
            });
    });

    after(async function () {
        // Close the server after the tests
        getServer().close();
    });

    // Add additional tests for other endpoints following the pattern above

});

// Run the tests with: npx mocha test/api.test.js
