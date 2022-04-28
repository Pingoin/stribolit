export interface Camera {
    sensorSize: { // in mm
        height: number, 
        width: number
    },
    pixelCount:{
        height: number, 
        width: number
    },
    name:string
}