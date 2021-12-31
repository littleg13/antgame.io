const FlagHandler = require("./handler/FlagHandler");

class Logger {
  constructor() {
    this.logger = require("logzio-nodejs").createLogger({
      token: "UKOLffEwBTJxXdUzPkeIMzsVJkoUiLrs",
      protocol: "https",
      host: "listener.logz.io",
      port: "8071",
      type: "AntGameAPI",
    });

    this.env = process.env.environment;
    if (this.env === undefined) {
      this.env = "NO ENV SET";
    }

    this.logError = this.logError.bind(this);
    this.logCacheResult = this.logCacheResult.bind(this);
  }

  log(obj) {
    this.logger.log({ ...obj, env: this.env });
  }

  logError(location, err) {
    if (this.env !== "NO ENV SET") {
      this.log({ message: "API Error", location: location, error: err });
    } else {
      console.log(location, err);
    }
  }

  async logCacheResult(cacheName, cacheMiss, key, value, time) {
    const shouldLogCacheResult = await FlagHandler.getFlagValue("should-log-cache-results");
    if (shouldLogCacheResult)
      this.log({
        message: "Cache Result",
        cacheName: cacheName,
        resultType: cacheMiss ? "miss" : "hit",
        key: key,
        value: value,
        time: time,
      });
  }
}
const SingletonInstance = new Logger();
module.exports = SingletonInstance;
