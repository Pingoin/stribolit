import { CouchBase } from '@triniwiz/nativescript-couchbase';
import { newTelescope, Telescope } from '../models/telescope.model';
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
        this.addOrUpdateDocument(cam,id);
    }

    private addOrUpdateDocument(doc:unknown, id:string){
        if (this.database.getDocument(id)) {
            this.database.updateDocument(id, doc);
        } else {
            this.database.createDocument(doc, id);
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

    get telescopeList():Telescope[]{

        return [
            {
                interface:"Telescope",
                name:"Dobson",
                aperture:208,
                focalLength:1200,
                variableFocalLength:false,
                minFocalLength:0,
                maxFocalLength:0,
                variableFNumber:false,
                fNumberMin:0,
                fNumberMax:0,
            },
            {
                interface:"Telescope",
                name:"Refraktor",
                aperture:70,
                focalLength:400,
                variableFocalLength:false,
                minFocalLength:0,
                maxFocalLength:0,
                variableFNumber:false,
                fNumberMin:0,
                fNumberMax:0,
            },
            {
                interface:"Telescope",
                name:"generic",
                aperture:25,
                focalLength:0,
                variableFocalLength:true,
                minFocalLength:18,
                maxFocalLength:135,
                variableFNumber:true,
                fNumberMin:3.5,
                fNumberMax:5.6,
            },

        ]
    }

    addTelescope(telescope: Telescope) {
        const id = telescope.interface + telescope.name;
        this.addOrUpdateDocument(telescope,id);
    }

    getTelescopeByName(name:string):Telescope{
        return this.telescopeList.filter(telescope=>telescope.name===name)[0]||newTelescope(name);
    }


}