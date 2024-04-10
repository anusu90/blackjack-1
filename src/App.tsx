import { EndGameComponent } from "./components/EndGame";
import { Game } from "./components/Game";
import { NewGame } from "./components/NewGame";
import { useGameStore } from "./store";

function App() {
  const gameDeckId = useGameStore((store) => store.deckId);

  const isGameOver = useGameStore((store) => store.isGameOver);

  return (
    <div className="w-full h-screen bg-white flex justify-center items-center flex-col gap-8">
      {isGameOver && <EndGameComponent />}
      <div className="px-2">{gameDeckId ? <Game /> : <NewGame />}</div>
    </div>
  );
}

export default App;
