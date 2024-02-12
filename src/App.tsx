import Questions from "./components/Questions";

/**
 * @abstract Demo application for the Questions component.
 */
function App() {
  return (<div>

    <div>
      Current Prompt (on generation [x])
    </div>

    <Questions />
  </div>);
}

export default App;
