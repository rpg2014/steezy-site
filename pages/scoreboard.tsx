import { NextPage } from "next";
import { ScoreboardList } from "../src/components/Scoreboard/Scoreboard";






const Scoreboard: NextPage = () => {
    // TODO: create score context that holds riders and their scores / other data, maybe just have it hold the list of earned rules, and then comp the total on the fly. 
    return <ScoreboardList />
}


export default Scoreboard