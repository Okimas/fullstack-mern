export const getElementOffset = (el) => {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = 0;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

export const isValidEmail = (input) => {
  if (!input || input.trim().length < 4) return false;
  const mailformat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (input.match(mailformat)) return true;
  return false;
};

export const dataURItoBlob = (dataURI) => {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var buffer = new ArrayBuffer(byteString.length);
  var data = new DataView(buffer);
  for (var i = 0; i < byteString.length; i++) {
    data.setUint8(i, byteString.charCodeAt(i));
  }
  return new Blob([buffer], { type: mimeString });
};
