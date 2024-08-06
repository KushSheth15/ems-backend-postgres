const express = require('express');
const router = express.Router();

const {createEvent,updateEvent,inviteUser,userCreatedAndInvitedEvents,getEventWithInvitedUsers,getUserEvents} = require("../controllers/event.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post('/create',verifyToken,createEvent);

router.put('/update/:id',verifyToken,updateEvent);

router.post('/invite/:id',verifyToken,inviteUser);

router.get('/created-Invited',verifyToken,userCreatedAndInvitedEvents);

router.get('/invited-events/:id',getEventWithInvitedUsers);

router.get('/get-events',verifyToken,getUserEvents);

module.exports = router;