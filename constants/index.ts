import {  BiHome } from "react-icons/bi";
import { BsPeopleFill, BsTrophyFill } from "react-icons/bs";
import { FaAward, FaClipboardList, FaGreaterThan, FaVoteYea } from "react-icons/fa";
import { FaCartShopping, FaTrophy } from "react-icons/fa6";

export const FOOTER = [
    {
        icon: FaCartShopping,
        label: "Shop",
        route: "/shop"
    },
    {
        icon: BsTrophyFill,
        label: "Leaderboard",
        route: "/leaderboard"
    },
    {
        icon: FaAward,
        label: "PERKS",
        route: "/dashboard"
    },
    {
        icon: FaClipboardList,
        label: "Tasks",
        route: "/tasks"
    },
    {
        icon: BsPeopleFill,
        label: "Friends",
        route: "/friends"
    },
]