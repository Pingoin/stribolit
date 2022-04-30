import { CouchBase, ConcurrencyMode } from '@triniwiz/nativescript-couchbase';
import { Camera, isCamera } from '../models/camera.model';

export class Database {
    private static instance: Database;

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    constructor() {
        this.database = new CouchBase('stribolit-db');
        this.initCameras();


    }

    private database: CouchBase;

    get cameraList(): Camera[] {
        return this.database.query({
            select: [], // Leave empty to query for all
            where: [{ property: 'interface', comparison: 'equalTo', value: 'Camera' }],
            order: [{ property: 'name', direction: 'asc' }],
            limit: 2,
        }).filter(isCamera);
    }

    private initCameras() {
        console.log("initCameras")
        console.log(this.cameraList.length)
        if (this.cameraList.length == 0) {
            const startCam: Camera = {
                interface: "Camera",
                sensorSize: { // in mm
                    height: 15.6,
                    width: 32.5
                },
                pixelCount: {
                    height: 4000,
                    width: 6000
                },
                name: "Sony Alpha 6400"
            };
            this.addCamera(startCam)
        }
    }

    addCamera(cam: Camera) {
        const id = cam.interface + cam.name;
        if (this.database.getDocument(id)) {
            this.database.updateDocument(id, cam);
        } else {
            this.database.createDocument(cam, id);
        }
    }
    getCameraByName(name: string): Camera {
        return <Camera>this.database.getDocument("Camera" + name) || {
            interface: "Camera",
            sensorSize: { // in mm
                height: 15.6,
                width: 32.5
            },
            pixelCount: {
                height: 15,
                width: 32
            },
            name: "Generic"
        };;
    }
}