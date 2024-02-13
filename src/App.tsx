import Questions from "./components/Questions";
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea";

/**
 * @abstract 
 * 
 * TODO:
 * - [ ] Add in localstorage for saving prompts
 * - [ ] Finish general project outline
 * - [ ] Finish inital popups detailing out the project
 */
function App() {
  return (
    <div>
      <div>
        <div>History</div>
        Current Prompt (on generation [x])
        <Textarea />
        <Button variant="default">Update</Button>
        <Button>Copy</Button>
      </div>

      <div>
        <Questions />
      </div>
    </div>
  );
}

export default App;
