import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <ErrorBoundary
        fallback={
          <div className="absolute inset-0 w-full h-full bg-transparent" aria-hidden />
        }
      >
        <Canvas />
      </ErrorBoundary>
      <Customizer />
    </main>
  )
}

export default App
