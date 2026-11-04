import { lazy, Suspense, useState } from 'react'
import Loader from './Loader'

const Scene = lazy(() => import('./Scene'))

export default function App() {
  const [started, setStarted] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)

  return (
    <>
      {started && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
      {!loaderGone && (
        <Loader
          leaving={started}
          onStart={() => {
            setStarted(true)
            setTimeout(() => setLoaderGone(true), 1200)
          }}
        />
      )}
    </>
  )
}
