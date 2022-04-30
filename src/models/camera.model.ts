export interface Camera {
    interface:"Camera",
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

export function isCamera(object: unknown):object is Camera{
    return (object as Camera).interface === "Camera";
}
