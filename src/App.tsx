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

function isFlood(x: number, y: number) {
    return floodMap[x] && floodMap[x][y] && floodMap[x][y].dataset.flooded === "true"
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
    const _level = Math.max(level(), 0)

    for (let i = 1; i < _level; i++) {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map.length; y++) {
                if (isLandTile(x, y)) {
                    const leftX = x - 1
                    const rightX = x + 1
                    const topY = y - 1
                    const bottomY = y + 1
                    const leftIsOcean = isOceanTile(leftX, y)
                    const rightIsOcean = isOceanTile(rightX, y)
                    const topIsOcean = isOceanTile(x, topY)
                    const bottomIsOcean = isOceanTile(x, bottomY)
                    const leftTopIsOcean = isOceanTile(leftX, topY)
                    const leftBottomIsOcean = isOceanTile(leftX, bottomY)
                    const rightTopIsOcean = isOceanTile(rightX, topY)
                    const rightBottomIsOcean = isOceanTile(rightX, bottomY)
                    const leftFloodX = x * 2
                    const rightFloodX = leftFloodX + 1
                    const topFloodY = y * 2
                    const bottomFloodY = topFloodY + 1
                    if (leftIsOcean) {
                        const _leftFloodX = x * 2 + i - 1
                        const leftFloodTileX = Math.floor(_leftFloodX / 2)
                        if (isLandTile(leftFloodTileX, y)) {
                            const leftTopFlood = floodMap[_leftFloodX]?.[topFloodY]
                            const leftBottomFlood = floodMap[_leftFloodX]?.[bottomFloodY]
                            if (leftTopFlood) OnFlood(leftTopFlood, i)
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }
                    }
                    if (rightIsOcean) {
                        const _rightFloodX = x * 2 - i + 2
                        const rightFloodTileX = Math.floor(_rightFloodX / 2)
                        if (isLandTile(rightFloodTileX, y)) {
                            const leftTopFlood = floodMap[_rightFloodX]?.[topFloodY]
                            const leftBottomFlood = floodMap[_rightFloodX]?.[bottomFloodY]
                            if (leftTopFlood) OnFlood(leftTopFlood, i)
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                        }
                    }
                    if (topIsOcean) {
                        const _topFloodY = y * 2 + i - 1
                        const topFloodTileY = Math.floor(_topFloodY / 2)
                        if (isLandTile(x, topFloodTileY)) {
                            const leftTopFlood = floodMap[leftFloodX]?.[_topFloodY]
                            const rightTopFlood = floodMap[rightFloodX]?.[_topFloodY]
                            if (leftTopFlood) OnFlood(leftTopFlood, i)
                            if (rightTopFlood) OnFlood(rightTopFlood, i)
                        }
                    }
                    if (bottomIsOcean) {
                        const _bottomFloodY = y * 2 - i + 2
                        const bottomFloodTileY = Math.floor(_bottomFloodY / 2)
                        if (isLandTile(x, bottomFloodTileY)) {
                            const leftBottomFlood = floodMap[leftFloodX]?.[_bottomFloodY]
                            const rightBottomFlood = floodMap[rightFloodX]?.[_bottomFloodY]
                            if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                            if (rightBottomFlood) OnFlood(rightBottomFlood, i)
                        }
                    }

                    for (let k = 1; k < i; k++) {
                        if (!leftIsOcean && !bottomIsOcean && isOceanTile(leftX, bottomY)) {
                            const floodX = x * 2 + k - 1
                            const floodY = y * 2 + 2 - i + k
                            const floodTileX = Math.floor(floodX / 2)
                            const floodTileY = Math.floor(floodY / 2)
                            if (isLandTile(floodTileX, floodTileY)) {
                                const leftBottomFlood = floodMap[floodX]?.[floodY]
                                if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                            }
                        }

                        if (!leftIsOcean && !topIsOcean && isOceanTile(leftX, topY)) {
                            const floodX = x * 2 + k - 1
                            const floodY = y * 2 + i - k - 1
                            const floodTileX = Math.floor(floodX / 2)
                            const floodTileY = Math.floor(floodY / 2)
                            if (isLandTile(floodTileX, floodTileY)) {
                                const leftBottomFlood = floodMap[floodX]?.[floodY]
                                if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                            }
                        }

                        if (!rightIsOcean && !bottomIsOcean && isOceanTile(rightX, bottomY)) {
                            const floodX = x * 2 - k + 2
                            const floodY = y * 2 + 2 - i + k
                            const floodTileX = Math.floor(floodX / 2)
                            const floodTileY = Math.floor(floodY / 2)
                            if (isLandTile(floodTileX, floodTileY)) {
                                const leftBottomFlood = floodMap[floodX]?.[floodY]
                                if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                            }
                        }

                        if (!rightIsOcean && !topIsOcean && isOceanTile(rightX, topY)) {
                            const floodX = x * 2 - k + 2
                            const floodY = y * 2 + i - k - 1
                            const floodTileX = Math.floor(floodX / 2)
                            const floodTileY = Math.floor(floodY / 2)
                            if (isLandTile(floodTileX, floodTileY)) {
                                const leftBottomFlood = floodMap[floodX]?.[floodY]
                                if (leftBottomFlood) OnFlood(leftBottomFlood, i)
                            }
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
