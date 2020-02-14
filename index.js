// implement your API here
const express = require('express')
const users = require('../node-api1-project/data/db')
const server = express()
server.use(express.json())


// When the client makes a `POST` request to `/api/users`:
// - If the request body is missing the `name` or `bio` property:
// - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.
//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_.
// - If there's an error while saving the _user_:
//- respond with HTTP status code `500` (Server Error).
//  return the following JSON object: `{ errorMessage: "There was an error while saving the user to the database" }`.

server.post('/api/users', (req, res) => {
    const newUser = req.body
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({message: 'Please provide name and bio for the user' })
    } else {
        users.insert(newUser)
            .then(res.status(201).json(newUser))
            .catch(res.status(500).json({errorMessage: 'There was an error while saving the user to the database'}))
    }
});


// When the client makes a `GET` request to `/api/users`: Returns an array of all user objects 
// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The users information could not be retrieved." }`.

server.get('/api/users/', (req, res)=>{
    users.find()
        .then(users=>{
            res.status(200).json({message: 'success', users: users})
        })
        .catch(err=>{
            res.status(500).json({errorMessage: 'The users information could not be retrieved.'})
        })
})



// When the client makes a `GET` request to `/api/users/:id`: should return the user object with the specified ID
//  - If the _user_ with the specified `id` is not found:
    //  respond with HTTP status code `404` (Not Found).
    //  return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.
// - If there's an error in retrieving the _user_ from the database:
    // - respond with HTTP status code `500`. 
    //  - return the following JSON object: `{ errorMessage: "The user information could not be retrieved." }`.

server.get('/api/users/:id', (req, res) => {
    users.findById(req.params.id)
    .then(user => { 
        if (user) {
        // if (user !== null || user !== undefined || user !== {}) {
            res.status(200).json({"fetchedUser": user})
        } else {
            res.status(404).json({message: 'The user with the specified ID does not exist.'})
        }
    })
    .catch(err => {
        res.status(500).json({errorMessage: 'The user information could not be retrieved'})
    })
});

// // When the client makes a `DELETE` request to `/api/users/:id`: Returns the number of records deleted
//   - If the _user_ with the specified `id` is not found:
//        - respond with HTTP status code `404` (Not Found).
//        - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.
//    - If there's an error in removing the _user_ from the database:
//        - respond with HTTP status code `500`.
//        - return the following JSON object: `{ errorMessage: "The user could not be removed" }`.

server.delete('/api/users/:id', (req, res) => {
    users.remove(req.params.id)
    .then(numRemoved => {
        if (numRemoved === 0) {
            res.status(404).json({message: "The user with the specified ID does not exist"})
        } else {
            res.status(200).json({message: "successfully removed user"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "The user could not be removed"})
    })
})


// // When the client makes a `PUT` request to `/api/users/:id`: Returns the count of updated records. 1 means a success
//     DONE If the _user_ with the specified `id` is not found:
//         - respond with HTTP status code `404` (Not Found).
//        - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.
//     DONE If the request body is missing the `name` or `bio` property:
//         - respond with HTTP status code `400` (Bad Request).
//         - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.
//         - update the user document in the database using the new information sent in the `request body`.
//     DONE If the user is found and the new information is valid:
//         - respond with HTTP status code `200` (OK).
//         - return the newly updated _user document_.
//     DONE     If there's an error when updating the _user_:
//         - respond with HTTP status code `500`.
//          return the following JSON object: `{ errorMessage: "The user information could not be modified." }`.

server.put('/api/users/:id', (req, res) => {
    users.update(req.params.id, req.body)
    .then(numReturned => {
        if (numReturned === 0) {
            res.status(404).json({message: "The user with the specified ID does not exist."})
        } else if (!req.body.name || !req.body.bio) {
            res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        } else {
            res.status(200).json({message: "Successfully updated", updatedUser: req.body})
        }
    })
    .catch(err => {
        console.log('put error: ', err)
        res.status(500).json({errorMessage: "The user information could not be modified"})
    })
})


server.listen(8080, ()=>{
    console.log('server started at http://localhost:8080')
})