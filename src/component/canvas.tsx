import { useCallback, useEffect, useRef } from 'react'
import { Controls } from '../App'
import { atom, useAtom } from 'jotai'

const imageDataAtom = atom<ImageData | null>(null)

export const Canvas = ({ controls }: { controls: Controls }) => {
    const {
        green: greenThreeshold,
        red: redThreeshold,
        blue: blueThreeshold,
    } = controls
    const ref = useRef<HTMLCanvasElement>(null!)
    const imageRef = useRef<HTMLImageElement>(null!)
    const [imageData, setImageData] = useAtom(imageDataAtom)
    const ctx = useRef<CanvasRenderingContext2D>()

    const grayscale = useCallback(() => {
        if (!imageData) return
        const tempData = new ImageData(imageData.width, imageData.height, {
            colorSpace: 'srgb',
        })

        for (let i = 0; i < imageData.height; i++) {
            for (let j = 0; j < imageData.width; j++) {
                const index = i * 4 * imageData.width + j * 4
                const red = imageData.data[index]
                const green = imageData.data[index + 1]
                const blue = imageData.data[index + 2]
                let average = 255

                if (green < 80 && red > 20 && blue > 20) {
                    for (let k = -1; k <= 1; k++) {
                        for (let l = -1; l <= 1; l++) {
                            const index2 =
                                (i + k) * 4 * imageData.width + (j + l) * 4
                            const red2 = imageData.data[index2]
                            const green2 = imageData.data[index2 + 1]
                            const blue2 = imageData.data[index2 + 2]

                            if (
                                green2 > greenThreeshold ||
                                red2 > redThreeshold ||
                                blue2 > blueThreeshold
                            ) {
                                average = 0
                                break
                            }
                        }
                    }
                }

                tempData.data[index] = average
                tempData.data[index + 1] = average
                tempData.data[index + 2] = average
                tempData.data[index + 3] = 255
            }
        }

        ctx.current?.putImageData(tempData, 0, 0)
        // const div = document.querySelector(
        //     '#canvas-wrapper',
        // ) as HTMLCanvasElement
        // div.appendChild(canvas)
    }, [imageData, greenThreeshold, redThreeshold, blueThreeshold])

    useEffect(() => {
        console.log(controls, 'RENDERED')
    }, [])

    useEffect(() => {
        grayscale()
    }, [grayscale])

    const onImageLoad = () => {
        const canvas = ref.current
        ctx.current = ref.current.getContext('2d') as CanvasRenderingContext2D
        const image = document.querySelector('#image') as HTMLImageElement
        const imgWidth = image.width
        const imgHeight = image.height

        canvas.width = imgWidth
        canvas.height = imgHeight
        ctx.current.drawImage(image, 0, 0)
        const imageData = ctx.current.getImageData(0, 0, imgWidth, imgHeight)
        setImageData(imageData)
        grayscale()
    }

    return (
        <>
            <canvas ref={ref}></canvas>
            <img
                ref={imageRef}
                id='image'
                src='https://media.istockphoto.com/id/1319961400/video/portrait-of-sexy-girl-flirting-with-her-object-of-love.jpg?s=640x640&k=20&c=9cQ76j6h5M-O1HPxgwmQebObpvm5ftz2_66YhjbM3Xw='
                crossOrigin='anonymous'
                onLoad={onImageLoad}
            />
        </>
    )
}
