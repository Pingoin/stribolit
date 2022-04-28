import { Camera } from "../models/camera.model";

export class CameraService {
    private cameras: Camera[] = [
        {
            sensorSize: { // in mm
                height: 15.6,
                width: 32.5
            },
            pixelCount: {
                height: 15,
                width: 32
            },
            name: "Generic"
        },
        {
            sensorSize: { // in mm
                height: 15.6,
                width: 32.5
            },
            pixelCount: {
                height: 4000,
                width: 6000
            },
            name: "Sony Alpha 6400"
        }
    ]

    static getInstance(): CameraService {
        return CameraService._instance;
    }

    private static _instance: CameraService = new CameraService();
    getCameras(){
        return this.cameras
    }

    getCameraByName(name:string):Camera{
        return this.cameras.find(cam=>cam.name===name)||{
            sensorSize: { // in mm
                height: 15.6,
                width: 32.5
            },
            pixelCount: {
                height: 15,
                width: 32
            },
            name: "Generic"
        };
    }
}