import styles from "./App.module.css"
import { createEffect, createSignal, For, on, onMount, type Component } from "solid-js"

type Map<t> = t[][]

const TielColor = {
    OceanTile: "Cyan",
    LandTile: "Cornsilk",
    BlockTile: "Black",
}

const map: Map<number> = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 3, 3, 3, 0, 3, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 3, 0, 0, 3, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 0],
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
    const color =
        (isLandTile(x, y) && TielColor.LandTile) || (isOceanTile(x, y) && TielColor.OceanTile) || TielColor.BlockTile
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

function floodCoordsToTileCoords(x: number, y: number) {
    return {
        x: Math.floor(x / 2),
        y: Math.floor(y / 2),
    }
}

function isFlood(x: number, y: number) {
    return floodMap[x] && floodMap[x][y] && floodMap[x][y].dataset.type !== undefined
}

function isFloodSource(x: number, y: number, level: number) {
    const { x: tileX, y: tileY } = floodCoordsToTileCoords(x, y)
    if (level <= 0) return isOceanTile(tileX, tileY)
    else return isFlood(x, y) && floodMap[x][y]?.dataset.type === level.toString()
}

function blockFlood(flood: HTMLElement) {
    flood.dataset.type = "block"
    flood.style.textAlign = "center"
    flood.style.backgroundColor = "red"
    flood.style.opacity = "0.5"
}

function OnFlood(flood: HTMLElement, level: number) {
    if (flood.dataset.type !== "undefined") return
    flood.dataset.type = level.toString()
    flood.textContent = level.toString()
    flood.style.textAlign = "center"
    flood.style.backgroundColor = "green"
    flood.style.opacity = "0.5"
}

function placeblockFlood() {
    blockFlood(floodMap[7][4]!)
    blockFlood(floodMap[7][5]!)
    blockFlood(floodMap[7][6]!)
    blockFlood(floodMap[7][7]!)
    blockFlood(floodMap[6][7]!)
    blockFlood(floodMap[8][4]!)
    blockFlood(floodMap[9][4]!)

    blockFlood(floodMap[12][4]!)
    blockFlood(floodMap[12][5]!)
    blockFlood(floodMap[12][6]!)
    blockFlood(floodMap[12][7]!)
    blockFlood(floodMap[13][4]!)
    blockFlood(floodMap[14][4]!)
    blockFlood(floodMap[14][5]!)
    blockFlood(floodMap[14][6]!)
    blockFlood(floodMap[14][7]!)
    blockFlood(floodMap[13][7]!)

    blockFlood(floodMap[31][7]!)
    blockFlood(floodMap[32][7]!)
    blockFlood(floodMap[30][7]!)
    blockFlood(floodMap[30][8]!)
    blockFlood(floodMap[30][9]!)
    blockFlood(floodMap[30][10]!)
    blockFlood(floodMap[30][11]!)
    blockFlood(floodMap[30][12]!)
    blockFlood(floodMap[30][13]!)
    blockFlood(floodMap[30][14]!)
    blockFlood(floodMap[30][15]!)
    blockFlood(floodMap[30][16]!)
    blockFlood(floodMap[30][17]!)
    blockFlood(floodMap[30][18]!)
    blockFlood(floodMap[30][19]!)
    blockFlood(floodMap[30][7]!)
    blockFlood(floodMap[32][8]!)
    blockFlood(floodMap[32][9]!)
    blockFlood(floodMap[32][10]!)
    blockFlood(floodMap[32][11]!)
    blockFlood(floodMap[32][12]!)
    blockFlood(floodMap[32][13]!)
    blockFlood(floodMap[32][14]!)
    blockFlood(floodMap[32][15]!)
    blockFlood(floodMap[32][16]!)
    blockFlood(floodMap[32][17]!)
    blockFlood(floodMap[31][17]!)
}

function clearFlood() {
    for (let x = 0; x < floodMap.length; x++) {
        for (let y = 0; y < floodMap.length; y++) {
            floodMap[y][x]!.textContent = ""
            floodMap[y][x]!.style.backgroundColor = ""
            floodMap[y][x]!.style.opacity = "1"
            floodMap[y][x]!.dataset.type = "undefined"
        }
    }
}

function onFloodRender() {
    const _level = Math.max(level(), 0)

    const SURROUNDING_OFFSETS = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ]

    for (let i = 1; i <= _level; i++) {
        for (let x = 0; x < floodMap.length; x++) {
            for (let y = 0; y < floodMap.length; y++) {
                if (isFloodSource(x, y, i - 1)) {
                    for (const offset of SURROUNDING_OFFSETS) {
                        const offsetX = x + offset.x
                        const offsetY = y + offset.y
                        const { x: tileX, y: tileY } = floodCoordsToTileCoords(offsetX, offsetY)
                        if (isLandTile(tileX, tileY)) {
                            OnFlood(floodMap[offsetX][offsetY]!, i)
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
            placeblockFlood()
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
