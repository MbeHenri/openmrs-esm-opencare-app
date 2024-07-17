class env {
  static API_USER = "";
  static API_PASSWORD = "";
  static API_PORT = "";
  static API_HOST = "";
  static API_SECURE = false;

  static API_BASE_URL(): string {
    return `http${this.API_SECURE ? "s" : ""}://${env.API_HOST}:${
      env.API_PORT
    }`;
  }
}

export default env;
