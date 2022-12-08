import { RiderLevels } from "../models"

export const combineStyles = (style1: string, style2: string, ...styles: string[]) => {
    if(styles.length === 0){
        return style1.concat(' ').concat(style2)
    }else {
        const temp = style1.concat(' ').concat(style2)
        styles.map((style)=> temp.concat(' ').concat(style))
        return temp
    }
}


export const riderLevelToPointsMap: Map<RiderLevels,string> = new Map()
.set(RiderLevels.GREEN, "greenPoints")
.set(RiderLevels.BLUE, "bluePoints")
.set(RiderLevels.BLACK, "blackPoints")
.set(RiderLevels.DOUBLEBLACK, "doubleBlackPoints")



export const getPoints = (levelPointsMap: any, riderLevel: RiderLevels | keyof typeof RiderLevels): number => {
    //@ts-ignore: We verify the rider level is in the map or we show 0
    return riderLevelToPointsMap.has(riderLevel as RiderLevels) ? Number.parseInt(levelPointsMap[riderLevelToPointsMap.get(riderLevel)]) : '0'
}



export const tagOptions = [undefined, "ACTION", "STEVENS_RUN", "WHISTLER_RUN"];
