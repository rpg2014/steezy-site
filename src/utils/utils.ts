import { RiderLevels } from "../models"

export const combineStyles = (style1: string, style2: string, ...styles: string[]) => {
    if(styles.length=== 0){
        return style1.concat(' ').concat(style2)
    }else {
        const temp = style1.concat(' ').concat(style2)
        styles.map((style)=> temp.concat(' ').concat(style))
    }
}


export const riderLevelToPointsMap: Map<RiderLevels,string> = new Map()
.set(RiderLevels.GREEN, "greenPoints")
.set(RiderLevels.BLUE, "bluePoints")
.set(RiderLevels.BLACK, "blackPoints")
.set(RiderLevels.DOUBLEBLACK, "doubleBlackPoints")