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

                    // Add audio player
                    var audio = document.createElement('audio');
                    audio.id = 'captcha-audio';
                    document.getElementById('captcha-block').appendChild(audio);
                }
            });
        };
    }

    var main = new gifCaptcha();
    var images = [
        'img/tree/1.jpg',
        'img/random/1.jpg',
        'img/tree/9.jpg',
        'img/tree/10.jpg',
        'img/random/3.jpg'
    ];

    main.createGIF(images);

})();
