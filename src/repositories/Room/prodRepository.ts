import { NC_BASE_URL, TALK_BASE64, TALK_BASE_URL } from "../env";
import Room from "../../models/Room";
import { base64 } from "../../utils";
import RoomRepository from "./repository";
import User from "../../models/User";


class ProdRoomRepository extends RoomRepository {

    async createUser(user_id: string, name: string, password: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var raw = JSON.stringify({
            "userid": user_id,
            "displayName": name,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        await fetch(`${NC_BASE_URL}/cloud/users`, requestOptions);
    }

    async createRoom(name: string = "ocare"): Promise<Room> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var formdata = new FormData();
        formdata.append("roomType", "2");
        formdata.append("roomName", name);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        const room: Room = await fetch(`${TALK_BASE_URL}/room`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const data = result.ocs.data;
                return { token: data.token, name: data.displayName }
            })

        return room;
    }

    async addUserInRoom(token_room: string, user_id: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var formdata = new FormData();
        formdata.append("newParticipant", user_id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };
        await fetch(`${TALK_BASE_URL}/room/${token_room}/participants`, requestOptions);
    }


    async getRelatedRooms(user_id: string, password: string): Promise<Array<Room>> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        const basic_key = base64(`${user_id}:${password}`);
        myHeaders.append("Authorization", `Basic ${basic_key}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        let rooms: Array<Room> = [];

        await fetch(`http://localhost:8010/ocs/v2.php/apps/spreed/api/v4/room`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const data: Array<any> = result.ocs.data;
                data.forEach(element => {
                    const name: string = element.displayName;
                    const token: string = element.token;
                    rooms.push({
                        token: token,
                        name: name
                    })
                });
            });

        return rooms;
    }

    async setRoomLinkable(token_room: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
        };

        await fetch(`${TALK_BASE_URL}/room/${token_room}/public`, requestOptions);
    }


    async setPasswordLinkedRoom(token_room: string, password: string): Promise<void> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var raw = JSON.stringify({
            "password": password
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
        };

        await fetch(`${TALK_BASE_URL}/room/${token_room}/password`, requestOptions);
    }

    async getRoomParticipants(token_room: string): Promise<Array<User>> {

        var myHeaders = new Headers();
        myHeaders.append("OCS-APIRequest", "true");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Basic ${TALK_BASE64}}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const participants: Array<User> = [];
        await fetch(`${TALK_BASE_URL}/room/${token_room}/participants`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const data: Array<any> = result.ocs.data;
                data.forEach(element => {
                    participants.push({
                        names: element.displayName,
                        id: element.actorId
                    })
                });
            });

        return participants;
    }
}

export default ProdRoomRepository;