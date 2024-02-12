import Questions from "./components/Questions";
import { Button } from "../@/components/ui/button"

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
        {/* <TextArea /> */}
        <Button variant="default">Update</Button>
        <Button>Copy</Button>
      </div>

      <Questions />
    </div>
  );
}

export default App;
