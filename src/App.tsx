import styles from "./index.module.css"
import "./app.css"

function App() {
  return (
    <>
      <div className={styles.app} role="main" onClick={() => console.log(1234)}>
        Hello World512!
      </div>
    </>
  );
}

export default App;

