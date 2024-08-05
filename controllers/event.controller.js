const db = require("../models/index");
const Event = db.Event;
const User = db.User;
const Invite = db.Invite;

const createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        if (!title || !description || !date || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        };

        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - No user found' });
        };

        const event = await Event.create({
            title,
            description,
            date,
            location,
            userId: user.id
        });

        return res.status(201).json(event);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error occurred while creating event' });
    }

}

const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        const { title, description, date, location, status } = req.body;

        const event = await Event.findOne({ where: { id: eventId, userId: userId } })
        if (!event) {
            return res.status(404).json({ error: 'Unauthorized user does not have permission' });
        };

        const updateEvent = await Event.update({
            title,
            description,
            date,
            location,
            status
        }, { where: { id: eventId } });

        return res.status(201).json({ message: "Event Updated Sucessfully", event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error occurred while updating event' });
    }
};

const inviteUser = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const eventId = req.params.id;
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        };

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        };

        const existingInvite = await Invite.findOne({
            where: { userId: user.id, eventId: eventId }
        });

        if (existingInvite) {
            return res.status(400).json({
                error: "Invitation already sent to this user for the event"
            });
        };

        const inviteData = await Invite.create({
            userId: user.id,
            eventId: eventId,
        });

        res.status(200).json({ message: "Invitation sent successfully", inviteData });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while inviting the user' });
    }
}

const userCreatedAndInvitedEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const showEvents = await User.findByPk(userId, {
            attributes: ["username", "email"],
            include: [
                {
                    model: Event,
                    as:"createdEvent",
                    attributes: ["title", "date", "location", "status"],
                },
                {
                    model: Event,
                    as:"invitedEvent",
                    attributes: ["title", "description", "date", "location", "status"],
                    through: { attributes: [] }
                }
            ]
        });

        return res.status(200).json(showEvents);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching user created and invited events' });
    }
};

const getEventWithInvitedUsers = async (req, res) => {
    try {
        const eventId = req.params.id;  

        // Find the event with invited users
        const event = await Event.findByPk(eventId, {
            attributes: ["title", "date"],
            include: [
                {
                    model: User,
                    as: 'invitedUsers',  
                    attributes: ["id", "username", "email"]  
                }
            ]
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json(event);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching event details' });
    }
};

module.exports = {
    createEvent,
    updateEvent,
    inviteUser,
    userCreatedAndInvitedEvents,
    getEventWithInvitedUsers
}