class env {

    static API_USER: string = ""
    static API_PASSWORD: string = ""
    static API_PORT: string = ""
    static API_HOST: string = ""

    static API_BASE_URL(): string {
        return `http://${env.API_HOST}:${env.API_PORT}`
    }
}

export default env