const zoomDelta = 0.5;
const minZoomLevel = -8; // Adjust as needed
const maxZoomLevel = 8; // Adjust as needed

function handleZoomChange(_event, zoomDirection, webContents) {
    var currentZoom = webContents.getZoomLevel();

    if (zoomDirection === "in" && currentZoom < maxZoomLevel) {
        webContents.setZoomLevel(currentZoom + zoomDelta);
    }
    if (zoomDirection === "out" && currentZoom > minZoomLevel) {
        webContents.setZoomLevel(currentZoom - zoomDelta);
    }
}

export default handleZoomChange;
