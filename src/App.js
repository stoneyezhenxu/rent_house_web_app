import './App.css'

function App () {

  console.log(`process.env.SITE :${process.env.REACT_APP_SITE}`)
  console.log(`process.env.SITE :${process.env.REACT_APP_ENVIRONMENT}`)
  return (
    <div className="App">
      hello
    </div>
  )
}

export default App
