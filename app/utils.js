const getImage = (name) => {

    if (window.library && window.library[name]) {
        return window.library[name];
    } else {

        var img1 = new Image();
        img1.onload = function() {
            window.library[name].status = "loaded";
        };
        img1.src = name;

        window.library[name] = {
            element: img1
        };

        return window.library[name];
    }


}

module.exports = {
    getImage: getImage
}
