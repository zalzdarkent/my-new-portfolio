import { useState } from 'react'
import Loader from './Loader'
import Scene from './Scene'
import { playStartupSound } from './sound'

export default function App() {
  const [started, setStarted] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)

  return (
    <>
      <Scene started={started} onLoaded={() => setModelsLoaded(true)} />
      {!loaderGone && (
        <Loader
          modelsLoaded={modelsLoaded}
          leaving={started}
          onStart={() => {
            playStartupSound()
            setStarted(true)
            setTimeout(() => setLoaderGone(true), 1200)
          }}
        />
      )}
    </>
  )
}
