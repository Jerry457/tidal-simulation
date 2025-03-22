const tiles = ""
const tiledata = ""
const nav = ""
const nodeidtilemap = ""

function decodeData(data: string): Uint8Array {
    if (!data.startsWith("VlJTTgABAAAA")) {
        throw new TypeError("传入数据不是编码后的饥荒地图数据")
    }

    // Base64 解码
    const binaryString = atob(data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    // 返回实际数据部分
    return bytes.slice(9)
}
function iterUnpack(format: string, data: Uint8Array): number[][] {
    const view = new DataView(data.buffer)
    const result: number[][] = []

    if (format === "<H") {
        // 解析为小端序的 16 位无符号整数
        for (let i = 0; i < data.length; i += 2) {
            result.push([view.getUint16(i, true)])
        }
    } else if (format === "<2B") {
        // 解析为两个 8 位无符号整数
        for (let i = 0; i < data.length; i += 2) {
            result.push([view.getUint8(i), view.getUint8(i + 1)])
        }
    }

    return result
}

function convertTiles(data: string): number[] {
    const dataReal = decodeData(data)
    return iterUnpack("<H", dataReal).flat()
}

function convertOldTiles(data: string): number[] {
    const dataReal = decodeData(data)
    return iterUnpack("<2B", dataReal).map(i => i[0])
}

function convertNodeIdTileMap(data: string): number[] {
    const dataReal = decodeData(data)

    return iterUnpack("<H", dataReal).flat()
}

function convertTileData(data: string): number[] {
    const dataReal = decodeData(data)
    // return iterUnpack("<H", dataReal).flat()

    const result = iterUnpack("<2B", dataReal).flat()
    return result.map(value => value)
}

function convertOldTileData(data: string): number[] {
    const dataReal = decodeData(data)
    return iterUnpack("<2B", dataReal).map(i => i[1])
}

function convertNav(data: string): number[] {
    const dataReal = decodeData(data)

    // 解析数据
    return iterUnpack("<H", dataReal).flat()
}
