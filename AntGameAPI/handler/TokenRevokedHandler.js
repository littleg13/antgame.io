const { getFlag } = require("../dao/FlagDao");
const { isUserBanned } = require("../dao/UserDao");
const { ExpiringResult } = require("../helpers/ExpiringResult");
const { ResultCache } = require("../helpers/ResultCache");
const FlagHandler = require("../handler/FlagHandler");

class TokenRevokedHandler {
  constructor() {
    this.resultCache = new ResultCache();
    this.timeToCache = null;
  }

  async isTokenValid(userID) {
    const loginsEnabled = await FlagHandler.getFlagValue("allow-logins");
    if (loginsEnabled !== true) return false;

    if (this.resultCache.isSetAndActive(userID)) {
      const IsValid = this.resultCache.getValue(userID);
      return IsValid;
    } else {
      if (!this.timeToCache || !this.timeToCache.isActive()) await this.refreshTimeToCache();

      let IsValid;
      try {
        const IsBanned = await isUserBanned(userID);
        IsValid = !IsBanned;
        this.resultCache.setItem(userID, IsValid, this.timeToCache.getValue());
      } catch (e) {
        console.error("Threw error getting token status in TokenRevokedHandler", e);
        return null;
      }
      return IsValid;
    }
  }

  async refreshTimeToCache() {
    const timeToCache = await FlagHandler.getFlagValue("time-between-token-checks");
    const expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + timeToCache);
    this.timeToCache = new ExpiringResult(expireAt, timeToCache);
    return;
  }
}
const SingletonInstance = new TokenRevokedHandler();
module.exports = SingletonInstance;
