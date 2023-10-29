import { GameData } from "@/types/gamedata";

const GameInfo = ({ game }: { game: GameData }) => {
    return (
        <div className="mx-4 mt-4 col-start-2 col-span-2 grid gap-7 grid-cols-2 h-auto">
            <div className="col-span-2">
                <div className="font-bold">Summary</div>
                <div>{game.summary || "N/A"}</div>
            </div>
            <div>
                <div className="font-bold">Genre</div>
                <div>{game.genres ? game.genres.join(", ") : "N/A"}</div>
            </div>
            <div>
                <div className="font-bold">Platforms</div>
                <div>{game.platforms ? game.platforms.join(", ") : "N/A"}</div>
            </div>
            <div>
                <div className="font-bold">Developers</div>
                <div>
                    {game.developers ? game.developers.join(", ") : "N/A"}
                </div>
            </div>
            <div>
                <div className="font-bold">Publishers</div>
                <div>
                    {game.publishers ? game.publishers.join(", ") : "N/A"}
                </div>
            </div>
            <div>
                <div className="font-bold">Age Rating</div>
                <div>{game.age_rating || "N/A"}</div>
            </div>
            <div>
                <div className="font-bold">Player Perspectives</div>
                <div>
                    {game.player_perspectives
                        ? game.player_perspectives.join(", ")
                        : "N/A"}
                </div>
            </div>
        </div>
    );
};

export default GameInfo;
