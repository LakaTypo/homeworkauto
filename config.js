(function () {
  function setApi(url) {
    url = String(url || "").trim().replace(/\/$/, "");
    window.HOMEWORK_AUTO_API = url;
    if (url) localStorage.setItem("homework_auto_api", url);
    else localStorage.removeItem("homework_auto_api");
  }
  var params = new URLSearchParams(location.search);
  if (params.get("api")) setApi(params.get("api"));
  else if (localStorage.getItem("homework_auto_api")) setApi(localStorage.getItem("homework_auto_api"));
  else window.HOMEWORK_AUTO_API = "";

  window.__haApiReady = fetch("api.txt", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.text() : ""; })
    .then(function (t) {
      if (!t) return;
      var line = t.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean)[0];
      if (line) setApi(line);
    })
    .catch(function () {})
    .then(function () {
      document.querySelectorAll("[data-api-field]").forEach(function (el) {
        if (window.HOMEWORK_AUTO_API) {
          el.style.display = "none";
          var input = el.querySelector("input");
          if (input) input.value = window.HOMEWORK_AUTO_API;
        }
      });
    });

  window.setHomework AutoApi = setApi;
  window.apiUrl = function (path) {
    if (!path.startsWith("/")) path = "/" + path;
    return window.HOMEWORK_AUTO_API ? window.HOMEWORK_AUTO_API + path : path;
  };
  window.apiHeaders = function (extra) {
    var h = Object.assign({ "Content-Type": "application/json" }, extra || {});
    var tok = localStorage.getItem("homework_auto_token");
    if (tok) h["Authorization"] = "Bearer " + tok;
    // ngrok free interstitial bypass
    if ((window.HOMEWORK_AUTO_API || "").indexOf("ngrok") !== -1) {
      h["ngrok-skip-browser-warning"] = "1";
    }
    return h;
  };
  window.apiFetch = function (path, opts) {
    opts = opts || {};
    opts.credentials = opts.credentials || "include";
    opts.headers = Object.assign(apiHeaders(), opts.headers || {});
    return fetch(apiUrl(path), opts);
  };
  window.saveAuthToken = function (token) {
    if (token) localStorage.setItem("homework_auto_token", token);
  };
  window.clearAuthToken = function () {
    localStorage.removeItem("homework_auto_token");
  };
})();
