(function () {
  function setApi(url) {
    url = String(url || "").trim().replace(/\/$/, "");
    window.STUDYFLOW_API = url;
    if (url) localStorage.setItem("studyflow_api", url);
    else localStorage.removeItem("studyflow_api");
  }
  const params = new URLSearchParams(location.search);
  if (params.get("api")) setApi(params.get("api"));
  else if (localStorage.getItem("studyflow_api")) setApi(localStorage.getItem("studyflow_api"));
  else window.STUDYFLOW_API = "";

  fetch("api.txt", { cache: "no-store" }).then(function (r) {
    if (!r.ok) return null;
    return r.text();
  }).then(function (t) {
    if (!t) return;
    var line = t.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean)[0];
    if (line && !params.get("api") && !localStorage.getItem("studyflow_api")) setApi(line);
  }).catch(function () {});

  window.setStudyflowApi = setApi;
  window.apiUrl = function (path) {
    if (!path.startsWith("/")) path = "/" + path;
    return window.STUDYFLOW_API ? window.STUDYFLOW_API + path : path;
  };
  window.apiHeaders = function (extra) {
    var h = Object.assign({ "Content-Type": "application/json" }, extra || {});
    var tok = localStorage.getItem("studyflow_token");
    if (tok) h["Authorization"] = "Bearer " + tok;
    return h;
  };
  window.apiFetch = function (path, opts) {
    opts = opts || {};
    opts.credentials = opts.credentials || "include";
    opts.headers = Object.assign(apiHeaders(), opts.headers || {});
    return fetch(apiUrl(path), opts);
  };
  window.saveAuthToken = function (token) {
    if (token) localStorage.setItem("studyflow_token", token);
  };
  window.clearAuthToken = function () {
    localStorage.removeItem("studyflow_token");
  };
})();
