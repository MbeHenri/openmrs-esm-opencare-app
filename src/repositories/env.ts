import { base64 } from "../utils";

class env {
    
    // Talk env variables
    static TALK_USER: string = ""
    static TALK_PASSWORD: string = ""
    static TALK_PORT: string = ""
    static TALK_HOST: string = ""
    
    static API_USER: string = ""
    static API_PASSWORD: string = ""
    static API_PORT: string = ""
    static API_HOST: string = ""

    static TALK_BASE64(): string {
        return base64(`${env.TALK_USER}:${env.TALK_PASSWORD}`)
    }

    static NC_BASE_URL(): string {
        return `http://${env.TALK_HOST}:${env.TALK_PORT}/ocs/v2.php`
    }

    static TALK_BASE_URL(): string {
        return `${env.NC_BASE_URL()}/apps/spreed/api/v4`
    }
    
    static API_BASE_URL(): string {
        return `http://${env.API_HOST}:${env.API_PORT}`
    }
}

export default env