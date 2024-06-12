import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUpload from './Component/Fileupload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h2>File upload</h2>
      <FileUpload />
    </>
  )
}

export default App
