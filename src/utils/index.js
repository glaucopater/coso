import * as THREE from 'three';
import { MAX_PLANE_SIZE } from "../settings";

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

export const RADIUS_SPHERE = 7;

/**
 * Convert [lat,lon] polar coordinates to [x,y,z] cartesian coordinates
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} radius
 * @return {Vector3}
 */
export function polarToCartesian(lon, lat, radius) {

    var phi = (90 - lat) * DEG2RAD
    var theta = (lon + 180) * DEG2RAD

    return {
        x: -(radius * Math.sin(phi) * Math.sin(theta)),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta),
    }
}


// convert the positions from a lat, lon to a position on a sphere.
export function latLongToVector3(lat, lon, radius, heigth) {
    var phi = (lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;

    var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
    var y = (radius + heigth) * Math.sin(phi);
    var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

export const convertLatLon = (point) => {
    const [x, y, z] = point;
    var lat = 90 - (Math.acos(y / RADIUS_SPHERE)) * 180 / Math.PI;
    var lon = ((270 + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180;
    return [lat, lon]
}

export const convertXYZ = (x, y, z) => {
    const phi = atan2(y, x);
    const theta = arccos(z / this.rho);

    this.x = this.rho * sin(this.theta) * cos(this.phi);
    this.y = this.rho * sin(this.theta) * sin(this.phi);
    this.z = this.rho * cos(this.theta);
}

/**
 *  (x - a)² + (y - b)² + (z - c)² = r²
 * 
 * 
 * x = r * cos(s) * sin(t)
 * y = r * sin(s) * sin(t)
 * z = r * cos(t)
 * 
 */
export const findPointsOnSphere = (d) => {
    const points = [];
    const minRange = 0;
    const maxRange = 24;
    for (var ss = minRange; ss < maxRange; ss++) {
        for (var tt = 0; tt <= 12; tt++) {
            const s = Math.PI * ss / 12;
            const t = Math.PI * tt / 12;
            var x = d * Math.cos(s) * Math.sin(t);
            var y = d * Math.sin(s) * Math.sin(t);
            var z = d * Math.cos(t);
            points.push([x, y, z])
        }
    }
    return points
}



const parameters = {};

export const fetchLiveData = () => {
    return fetch(apiUrl, parameters)
        .then(response => {
            return response.text()
        })
        .then((data) => {
            return data ? JSON.parse(data) : {}
        })
        .catch((error) => {
            console.log(error)
        })
}


export const changePlayerPosition = (action, setPosition) => {
    switch (action) {
        case "right":
            setPosition((prevPos) => [prevPos[0] + 1, prevPos[1], prevPos[2]]);
            break;
        case "left":
            setPosition((prevPos) => [prevPos[0] - 1, prevPos[1], prevPos[2]])
            break;
        case "up":
            setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] - 1])
            break;
        case "down":
            setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] + 1]);
            break;
    }
}



export const obeyLimits = (x, z) => {
    return (x <= MAX_PLANE_SIZE && x >= -MAX_PLANE_SIZE && z >= -MAX_PLANE_SIZE && z <= MAX_PLANE_SIZE);
}

export const delay = (ms) => {
    return (x) => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

function waitForMillisec(milisec) {
    return new Promise(resolve => {
        const timer = setTimeout(() => { resolve('') }, milisec);
    })
}

export async function timedLoopArray(arr, millisec, callback) {
    for (let i = 0; i < arr.length; ++i) {
        await waitForMillisec(millisec).then(() => {
            console.log("back to " + i);
        });
        if (callback) {
            callback(arr[i]);
        }
    }
}