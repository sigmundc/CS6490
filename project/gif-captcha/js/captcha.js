(function () {

    function gifCaptcha() {
        this.createGIF = function (images) {
            gifshot.createGIF({
                gifWidth: 200,
                gifHeight: 200,
                images: images,
                interval: 0.6,
                numFrames: 20,
                frameDuration: 1,
                fontWeight: 'normal',
                fontSize: '16px',
                fontFamily: 'sans-serif',
                fontColor: '#ffffff',
                textAlign: 'center',
                textBaseline: 'bottom',
                sampleInterval: 10,
                numWorkers: 2
            }, function (obj) {
                if (!obj.error) {
                    var image = obj.image, animatedImage = document.createElement('img');
                    animatedImage.src = image;
                    document.getElementById('captcha-block').appendChild(animatedImage);
                }
            });
        };
    }

    var main = new gifCaptcha();
    var images = [
        'http://i.imgur.com/2OO33vX.png',
        'http://i.imgur.com/qOwVaSN.png',
        'http://i.imgur.com/Vo5mFZJ.gif'
    ];

    main.createGIF(images);

})();
