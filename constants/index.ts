import {  BiHome } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { FaAward, FaClipboardList, FaGreaterThan, FaVoteYea } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";

export const FOOTER = [
    {
        icon: IoStatsChart,
        label: "Leaderboard",
        route: "/leaderboard"
    },
    {
        icon: FaVoteYea,
        label: "Vote",
        route: "/vote"
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