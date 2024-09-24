function detectTrackPad(e) {
    var isTrackpad = false;
    if (e.wheelDeltaY) {
        if (Math.abs(e.wheelDeltaY) !== 120) {
            isTrackpad = true;
        }
    }
    else if (e.deltaMode === 0) {
        isTrackpad = true;
    }
    isTrackpad ? scrollStrength = 0.00035 : scrollStrength = 0.0035;
}

export default detectTrackPad;