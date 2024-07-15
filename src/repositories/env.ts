class env {

    static API_USER: string = ""
    static API_PASSWORD: string = ""
    static API_PORT: string = ""
    static API_HOST: string = ""
    static API_SECURE: boolean = false;

    static API_BASE_URL(): string {
        return `http${this.API_SECURE ? "s" : ""}://${env.API_HOST}:${env.API_PORT}`
    }
}

export default env