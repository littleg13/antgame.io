const {
  getUsersLoggedIn,
  getConfigListFromDB,
  getConfigDetailsByID,
  updateConfigByID,
  addNewConfig,
} = require("../dao/AdminDao");

async function getStats(req, res) {
  let response = {
    uniqueUserStats: {},
  };

  let loginStatPromises = [];
  loginStatPromises.push(getUsersLoggedIn(24));
  loginStatPromises.push(getUsersLoggedIn(72));
  loginStatPromises.push(getUsersLoggedIn(168));

  await Promise.all(loginStatPromises).then(values => {
    values.forEach(result => {
      response.uniqueUserStats[result.hours] = result.users;
    });
  });

  res.send(response);
  return;
}

async function getConfigList(req, res) {
  try {
    res.send(await getConfigListFromDB());
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
}

async function getConfigDetails(req, res) {
  try {
    const id = req.params.id;
    let result = await getConfigDetailsByID(id);

    if (result.records) {
      let modifiedRecords = result.records;
      for (let i = 0; i < modifiedRecords.length; i++) {
        const record = modifiedRecords[i];
        const timestamp = record.runID.getTimestamp();
        modifiedRecords[i].time = timestamp;
      }
      result.records = modifiedRecords;
    }
    res.send(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
}

async function putConfig(req, res) {
  try {
    const request = req.body;

    const id = req.params.id;

    const newOrder = request.order;
    const newActive = request.active;

    const putRequest = {};
    if (newOrder !== undefined) {
      if (typeof newOrder !== "number") {
        res.sendStatus(400);
        return;
      } else {
        putRequest.order = newOrder;
      }
    }

    if (newActive !== undefined) {
      if (typeof newActive !== "boolean") {
        res.sendStatus(400);
        return;
      } else {
        putRequest.active = newActive;
      }
    }

    updateConfigByID(id, putRequest);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
}

async function postConfig(req, res) {
  try {
    const newConfigRequest = req.body;

    const mapPath = newConfigRequest.mapPath;
    const name = newConfigRequest.name;
    const time = parseInt(newConfigRequest.time);
    const homeLimit = parseInt(newConfigRequest.homeLimit);

    if (!mapPath || !time || !name || !homeLimit) {
      res.sendStatus(400);
      return;
    }

    const newConfig = {
      name: name,
      mapPath: mapPath,
      seconds: time,
      homeLimit: homeLimit,
      active: false,
    };

    const result = await addNewConfig(newConfig);
    res.send(result._id);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
}

module.exports = { getStats, getConfigList, getConfigDetails, putConfig, postConfig };
