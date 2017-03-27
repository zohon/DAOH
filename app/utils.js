const getImage = (name) => {

    if(window.library === undefined) {
      window.library = [];
    }

    if (window.library && window.library[name]) {
        return window.library[name];
    } else {

        var img1 = new Image();

        window.library[name] = {
            element: img1
        };

        img1.onload = function() {
            window.library[name].status = "loaded";
        };

        img1.src = name;

        return window.library[name];
    }
}

module.exports = {
    getImage: getImage
}
