const express = require('express');
const router = express.Router();

const {createEvent,updateEvent,inviteUser,userCreatedAndInvitedEvents,getEventWithInvitedUsers,getUserEvents} = require("../controllers/event.controller");
const verifyToken = require("../middlewares/auth.middleware");

const {EVENT_ROUTES} = require("../constants/routes.constants");

router.post(EVENT_ROUTES.CREATE, verifyToken, createEvent);
router.put(EVENT_ROUTES.UPDATE, verifyToken, updateEvent);
router.post(EVENT_ROUTES.INVITE, verifyToken, inviteUser);
router.get(EVENT_ROUTES.CREATED_INVITED, verifyToken, userCreatedAndInvitedEvents);
router.get(EVENT_ROUTES.INVITED_EVENTS, getEventWithInvitedUsers);
router.get(EVENT_ROUTES.GET_EVENTS, verifyToken, getUserEvents);

module.exports = router;