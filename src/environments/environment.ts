export const environment = {
  production: false,
  host: window.location.hostname,
  port: 9050,
  portMinio: 9000,

  get baseUrl() {
    return `http://${this.host}:${this.port}`;
  },

  get apiUrl() {
    return `http://${this.host}:${this.port}/api`;
  },

  get minioThumbUrl() {
    return `http://${this.host}:${this.portMinio}/ruzi/thumb/`;
  },

  get wsUrl() {
    return `ws://${this.host}:${this.port}`;
  }
};
