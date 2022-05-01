export interface Telescope {
    interface:"Telescope",
    name:string,
    aperture:number,
    focalLength:number,
    variableFocalLength:boolean,
    minFocalLength:number,
    maxFocalLength:number,
    variableFNumber:boolean,
    fNumberMin:number,
    fNumberMax:number,
}

export function isTelescope(object: unknown):object is Telescope{
    return (object as Telescope).interface === "Telescope";
}

export function newTelescope(name:string):Telescope{
    return {
        interface:"Telescope",
        name:name,
        aperture:0,
        focalLength:0,
        variableFocalLength:false,
        minFocalLength:0,
        maxFocalLength:0,
        variableFNumber:false,
        fNumberMin:0,
        fNumberMax:0,
    }
}