const express = require("express");
const authRoutes = require("./authRoute");
const PpropertyRoutes = require("./property.route");
const ProfileRoutes = require("./profile.Route");
const userAction = require("./userAction.route")
const CityRoutes = require("./city.route");
const MusicRoutes = require("./music.route");
const BoastRoutes = require("./boast.route");
const emiRoutes = require("./emi.route")
const mapRoutes = require("./map.route")
const adminRoutes = require("./admin.route")
const paymentRoute = require("./payment.route")
const loanRoute = require("./loan.route")

const router = express.Router();

const defaultRoutes = [
    { 
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/property',
        route: PpropertyRoutes
    },
    {
        path: '/profile',
        route: ProfileRoutes
    },
    {
        path:'/userAction',
        route:userAction
    },
    {
        path: '/city',
        route: CityRoutes
    },
    {
        path: '/music',
        route: MusicRoutes
    },
    {
        path: '/boast',
        route: BoastRoutes
    },
    {
        path: '/emi',
        route: emiRoutes
    },
    {
        path: '/map',
        route: mapRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/loan',
        route: loanRoute
    },
    {
        path:'/payment',
        route:paymentRoute
    }
    
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;


