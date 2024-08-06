const USER_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login',
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password',
    UPDATE_PASSWORD: '/update-password',
    LOGOUT: '/logout'
};

const EVENT_ROUTES = {
    CREATE: '/create',
    UPDATE: '/update/:id',
    INVITE: '/invite/:id',
    CREATED_INVITED: '/created-invited',
    INVITED_EVENTS: '/invited-events/:id',
    GET_EVENTS: '/get-events'
};

const ROUTE_PREFIXES = {
    USER: '/api/v1/user',
    EVENT: '/api/v1/event'
};

module.exports = {
    USER_ROUTES,
    EVENT_ROUTES,
    ROUTE_PREFIXES
};