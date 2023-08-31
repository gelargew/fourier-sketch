import { useControls } from 'leva'
import './App.css'
import { Canvas } from './component/canvas'

const defaultValues = {
    green: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    red: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    blue: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    contrast: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
}

export type Controls = {
    green: number
    red: number
    blue: number
    contrast: number
}

function App() {
    const controls = useControls(defaultValues)
    return (
        <>
            <Canvas controls={controls} />
        </>
    )
}

export default App
