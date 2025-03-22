import styles from "./App.module.css"
import { createEffect, createSignal, For, on, onMount, type Component } from "solid-js"

type Map<t> = t[][]

const TielColor = {
    OceanTile: "Cyan",
    LandTile: "Cornsilk",
}

const map: Map<number> = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
]
const floodMap: Map<HTMLElement | null> = []

const mapWidth = map.length
const mapHeight = map[0].length
const tileSize = 40
const floodSize = tileSize / 2

const [level, setLevel] = createSignal(0)

for (let y = 0; y < mapWidth * 2; y++) {
    floodMap[y] = []
    for (let x = 0; x < mapHeight * 2; x++) {
        floodMap[y][x] = null
    }
}

function isLandTile(x: number, y: number) {
    return (map[y] && map[y][x] === 0) || false
}

function isOceanTile(x: number, y: number) {
    return (map[y] && map[y][x] === 1) || false
}

function Tile({ tile, x, y }: { tile: number; x: number; y: number }) {
    const color = (isLandTile(x, y) && TielColor.LandTile) || TielColor.OceanTile
    const left = x * tileSize
    const top = y * tileSize
    return (
        <div
            style={{
                position: "absolute",
                left: `${left}px`,
                top: `${top}px`,
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                background: `${color}`,
            }}
        ></div>
    )
}

function TIleMap() {
    return <For each={map}>{(row, y) => <For each={row}>{(tile, x) => <Tile x={x()} y={y()} tile={tile} />}</For>}</For>
}

const [renderedCount, setRenderedCount] = createSignal(0)
function Flood({ x, y, color }: { x: number; y: number; color?: string }) {
    let floodRef: HTMLDivElement
    const left = x * floodSize
    const top = y * floodSize

    onMount(() => {
        floodMap[x][y] = floodRef!
        setRenderedCount(pre => pre + 1)
    })

    return (
        <div
            style={{
                position: "absolute",
                left: `${left}px`,
                top: `${top}px`,
                width: `${floodSize}px`,
                height: `${floodSize}px`,
                "z-index": 1,
                background: `${color}`,
            }}
            ref={floodRef!}
        ></div>
    )
}

function OnFlood(flood: HTMLElement, level: number) {
    if (flood.dataset.flooded === "true") return
    flood.dataset.flooded = "true"
    flood.textContent = level.toString()
    flood.style.textAlign = "center"
    flood.style.backgroundColor = "green"
    flood.style.opacity = "0.5"
}

function clearFlood() {
    for (let x = 0; x < floodMap.length; x++) {
        for (let y = 0; y < floodMap.length; y++) {
            floodMap[y][x]!.textContent = ""
            floodMap[y][x]!.style.backgroundColor = ""
            floodMap[y][x]!.style.opacity = "1"
            floodMap[y][x]!.dataset.flooded = undefined
        }
    }
}

function onFloodRender() {
    for (let x = 0; x < floodMap.length; x++) {
        for (let y = 0; y < floodMap.length; y++) {
            let leftIsOcean = false
            let rightIsOcean = false
            let topIsOcean = false
            let bottomIsOcean = false
            if (isLandTile(x, y)) {
                const leftX = x - 1
                const rightX = x + 1
                const topY = y - 1
                const bottomY = y + 1
                leftIsOcean = isOceanTile(leftX, y)
                rightIsOcean = isOceanTile(rightX, y)
                topIsOcean = isOceanTile(x, topY)
                bottomIsOcean = isOceanTile(x, bottomY)
                const _level = Math.max(level(), 0)
                for (let i = 1; i < _level; i++) {
                    const offset = Math.floor((i - 1) / 2)
                    if (leftIsOcean && isLandTile(x + offset, y)) {
                        const floodLeft = x * 2 + i - 1
                        const leftTopFlood = floodMap[floodLeft]?.[y * 2]
                        const leftBottomFlood = floodMap[floodLeft]?.[y * 2 + 1]
                        if (leftTopFlood) OnFlood(leftTopFlood, i)
                        if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                    }
                    if (rightIsOcean && isLandTile(x - offset, y)) {
                        const floodRight = x * 2 - i + 2
                        const rightTopFlood = floodMap[floodRight]?.[y * 2]
                        const rightBottomFlood = floodMap[floodRight]?.[y * 2 + 1]
                        if (rightTopFlood) OnFlood(rightTopFlood, i)
                        if (rightBottomFlood) OnFlood(rightBottomFlood, i)
                    }
                    if (topIsOcean && isLandTile(x, y + offset)) {
                        const floodTop = y * 2 + i - 1
                        const topLeftFlood = floodMap[x * 2]?.[floodTop]
                        const topRightFlood = floodMap[x * 2 + 1]?.[floodTop]
                        if (topLeftFlood) OnFlood(topLeftFlood, i)
                        if (topRightFlood) OnFlood(topRightFlood, i)
                    }
                    if (bottomIsOcean && isLandTile(x, y - offset)) {
                        const floodBottom = y * 2 - i + 2
                        const topLeftFlood = floodMap[x * 2]?.[floodBottom]
                        const topRightFlood = floodMap[x * 2 + 1]?.[floodBottom]
                        if (topLeftFlood) OnFlood(topLeftFlood, i)
                        if (topRightFlood) OnFlood(topRightFlood, i)
                    }

                    for (let k = 1; k < i; k++) {
                        const floodLeft = x * 2 + k - 1
                        const floodBottom = y * 2 + 2 - i + k
                        if (
                            !leftIsOcean &&
                            !bottomIsOcean &&
                            isOceanTile(leftX, bottomY) &&
                            isLandTile(Math.floor(floodLeft / 2), Math.floor(floodBottom / 2))
                        ) {
                            const leftBottomFlood = floodMap[floodLeft]?.[floodBottom]
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }

                        const floodTop = y * 2 + i - k - 1
                        if (
                            !leftIsOcean &&
                            !topIsOcean &&
                            isOceanTile(leftX, topY) &&
                            isLandTile(Math.floor(floodLeft / 2), Math.floor(floodTop / 2))
                        ) {
                            const leftBottomFlood = floodMap[floodLeft]?.[floodTop]
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }

                        const floodRihgt = x * 2 - (k - 1) + 1
                        if (
                            !rightIsOcean &&
                            !bottomIsOcean &&
                            isOceanTile(rightX, bottomY) &&
                            isLandTile(Math.floor(floodRihgt / 2), Math.floor(floodBottom / 2))
                        ) {
                            const leftBottomFlood = floodMap[floodRihgt]?.[floodBottom]
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }

                        if (
                            !rightIsOcean &&
                            !topIsOcean &&
                            isOceanTile(rightX, topY) &&
                            isLandTile(Math.floor(floodRihgt / 2), Math.floor(floodTop / 2))
                        ) {
                            const leftBottomFlood = floodMap[floodRihgt]?.[floodTop]
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }
                    }
                }
            }
        }
    }
}

function FloodMap() {
    onMount(() => {
        setRenderedCount(0)
    })
    createEffect(() => {
        level()
        if (renderedCount() === floodMap.length ** 2) {
            clearFlood()
            onFloodRender()
        }
    })
    return <For each={floodMap}>{(row, y) => <For each={row}>{(flood, x) => <Flood x={x()} y={y()} />}</For>}</For>
}

const App: Component = () => {
    return (
        <div style={styles.App}>
            <div>
                <label style={{ "font-size": "40px", margin: "10px" }}>tidal level:</label>
                <input
                    style={{ "font-size": "40px", margin: "10px" }}
                    type="number"
                    value={level()}
                    onChange={e => setLevel(Number(e.target.value))}
                />
            </div>
            <div style={{ position: "relative" }}>
                <TIleMap />
                <FloodMap />
            </div>
        </div>
    )
}

export default App
