window.addEventListener("load", f);

function f() {
  const buttons = document.querySelector(
    "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(2) > div > h3 > div > div.col-12.col-lg-12.mb-3 > div"
  );
  
  const recipeModeButton = buttons.children[1];
  const mapDropModeButton = buttons.children[2];

  const addCharacterButton = document.querySelector(
    "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(1) > div.row.mb-1 > div > div > button:nth-child(1)"
  );
  addCharacterButton.addEventListener("click", removeExtraNodes);

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.info === "parseRecipe") {
      recipeModeButton.dispatchEvent(new Event("click"));
      setTimeout(function () {
        if (getDemands()) {
          sendResponse({ info: "success" });
        } else {
          sendResponse({ info: "failure" });
        }
      }, 500);
    } else if (message.info === "parseMapDrop") {
      mapDropModeButton.dispatchEvent(new Event("click"));
      removeExtraNodes();
      setTimeout(function () {
        if (getMapData()) {
          sendResponse({ info: "success" });
        } else {
          sendResponse({ info: "failure" });
        }
      }, 500);
    } else if (message.info === "mapTable") {
      mapDropModeButton.dispatchEvent(new Event("click"));
      if (mapTable()) {
        sendResponse({ info: "success" });
      } else {
        sendResponse({ info: "failure" });
      }
    } else {
      sendResponse({ info: "failure" });
    }
    return true;
  });
}

function mapTable() {
  removeExtraNodes();
  chrome.storage.local.get(["plan", "options"], function (items) {
    let { plan, options } = items;
    const { multiplier, displayInt } = options;

    // 包含一组th的父元素
    let thead = document.querySelector(
      "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > table > thead > tr:nth-child(2)"
    );
    let th = document.createElement("th");
    th.innerText = "建议次数";
    th.style.verticalAlign = "baseline";
    th.className = "extra";
    thead.appendChild(th);

    let tbody = document.querySelector(
      "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > table > tbody"
    );

    Array.from(tbody.children).forEach(function (tr) {
      const mapName = tr.children[0].innerText;
      tr.children[0].setAttribute("rowspan", "1");
      if (plan[mapName]) {
        let td = document.createElement("td");
        td.innerText = displayInt
          ? Math.ceil(plan[mapName] / multiplier)
          : (plan[mapName] / multiplier).toFixed(2);
        td.className = "extra";
        tr.appendChild(td);
      } else {
        tr.style.display = "none";
      }
    });
  });
  return true;
}

function removeExtraNodes() {
  let nodes = document.getElementsByClassName("extra");
  if (nodes) {
    Array.from(nodes).forEach(function (node) {
      node.remove();
    });
  }
}

function getDemands() {
  if (!document.getElementsByClassName("recipe-mode")[0]) return false;

  const demandCardTable = document.getElementsByClassName("recipe-mode")[0]
    .children[0];

  let result = {};
  for (let item of demandCardTable.children) {
    const name = item.getElementsByTagName("h6")[0].innerText;
    const number = item.getElementsByClassName("badge-danger")[0].innerText;
    result[name] = { min: parseInt(number) };
  }

  chrome.storage.local.set({ demands: result }, function () {
    console.log("Demands storage complete.");
  });

  return true;
}

function getMapData() {
  const rowsPerPageSelect = document.querySelector(
    "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > div > div:nth-child(3) > div > div > select"
  );
  if (!rowsPerPageSelect) return false;

  if (rowsPerPageSelect.value == 1000) {
    return getData();
  } else {
    rowsPerPageSelect.value = 1000;
    rowsPerPageSelect.dispatchEvent(new Event("change"));
    setTimeout(getData, 500);
    return true;
  }
}

function getData() {
  if (!document.getElementsByClassName("mapDrop-table")[0]) return false;

  const mapDropTable = document.getElementsByClassName("mapDrop-table")[1];
  const tableRows = mapDropTable.getElementsByTagName("tr");

  let result = {};
  for (let tr of tableRows) {
    if (!tr.children[1]) continue;

    const mapName = tr.children[0].innerText;
    let dropData = {};

    const items = tr.getElementsByClassName("mapDrop-item");
    for (let item of items) {
      const number = item.getElementsByClassName("text-center py-1 d-block")[0]
        .innerText;
      if (!number || number === "0") continue;

      const name = item.getElementsByTagName("img")[0].title;
      const dropRate = item.getElementsByTagName("h6")[0].innerText;
      dropData[name] = parseFloat(dropRate) / 100.0;
      dropData.farmTime = 1;
    }
    const chapterIndex = mapName.slice(0, mapName.indexOf("-"));
    const apCost = Math.min(7 + Math.ceil(chapterIndex / 3), 10);
    result[mapName] = dropData;
    result[mapName].apCost = apCost;
  }

  chrome.storage.local.set({ mapData: result }, function () {
    console.log("MapData Storage complete.");
  });

  return true;
}
