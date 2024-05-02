import { base64 } from "../utils";

// Talk env variables
export const TALK_USER = "admin";
export const TALK_PASSWORD = "Admin123";
export const TALK_PORT = "8010";
export const TALK_HOST = "localhost";

export const TALK_BASE64 = base64(`${TALK_USER}:${TALK_PASSWORD}`);

export const NC_BASE_URL = `http://${TALK_HOST}:${TALK_PORT}/ocs/v2.php`
export const TALK_BASE_URL = `${NC_BASE_URL}/apps/spreed/api/v4`;
