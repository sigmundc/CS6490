(function () {

    // function gifCaptcha() {
    //     this.createGIF = function (images) {
    //         gifshot.createGIF({
    //             gifWidth: 200,
    //             gifHeight: 200,
    //             images: images,
    //             interval: 0.6,
    //             numFrames: 20,
    //             frameDuration: 1,
    //             fontWeight: 'normal',
    //             fontSize: '16px',
    //             fontFamily: 'sans-serif',
    //             fontColor: '#ffffff',
    //             textAlign: 'center',
    //             textBaseline: 'bottom',
    //             sampleInterval: 10,
    //             numWorkers: 2
    //         }, function (obj) {
    //             if (!obj.error) {
    //                 var image = obj.image, animatedImage = document.createElement('img');
    //                 animatedImage.src = image;
    //                 document.getElementById('captcha-block').appendChild(animatedImage);

    //                 // Add audio player - audio challenge
    //                 var audio = document.createElement('audio');
    //                 audio.id = 'captcha-audio';
    //                 document.getElementById('captcha-block').appendChild(audio);
    //             }
    //         });
    //     };
    // }

    // var main = new gifCaptcha();
    // var images = [
    //     'img/tree/1.jpg',
    //     'img/random/1.jpg',
    //     'img/tree/9.jpg',
    //     'img/tree/10.jpg',
    //     'img/random/3.jpg'
    // ];

    // main.createGIF(images);

    function iCaptcha() {
        this.selectedImages = [];
        this.challenges = {};
        var self = this;

        this.init = function () {
            // Assign click event listener (event bubbling)
            var captchaBlock = document.getElementById('captcha-block');
            captchaBlock.onclick = this.selectImage;

            // var form = document.form;
            // console.log(form);
            document.getElementById('btn-submit').onclick = this.signUp;

            // Add audio player - audio challenge
            var audio = document.createElement('audio');
            audio.id = 'captcha-player';
            audio.src = 'audio/c1.mp3';
            document.getElementById('captcha-block').appendChild(audio);

            // Get challenges from challenges.json
            self.getCaptcha();
        }

        this.selectImage = function (event) {
            // console.log(event);
            // Toggle class name to show selection on the UI
            var selection = event.target.parentNode;
            selection.classList.toggle('selected');


            if (self.selectedImages.indexOf(selection.id) > -1) {
                self.selectedImages.splice(self.selectedImages.indexOf(selection.id), 1);
            } else {
                // Add to selection
                self.selectedImages.push(selection.id);
            }
            // console.log("selection: ");
            // console.log(self.selectedImages);
        };

        this.signUp = function (e) {
            // e.preventDefault();

            console.log('Sign Up button clicked..');
            var emailElement = document.getElementById("email");
            var passwordElement = document.getElementById("password");
            var email = emailElement.value;
            var password = passwordElement.value;

            // Clear validation
            emailElement.classList.remove('is-invalid');
            passwordElement.classList.remove('is-invalid');
            var errors = 0;

            if (!self.validateEmail(email)) {
                // Add validation error to UI here
                emailElement.classList.add('is-invalid');
                errors++;
            }
            if (password.length < 8) {
                passwordElement.classList.add('is-invalid');
                errors++;
            }

            if (errors > 0) {
                console.log("form validation failed.");
                return;
            }

            // console.log(email);
            // console.log(password);
            console.log(self.selectedImages);
        }

        this.getCaptcha = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "data/challenges.json", true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        self.challenges = JSON.parse(xhr.responseText).challenges;

                        // TODO: Randomly select a challenge here
                        self.createCaptcha(self.challenges[0]);
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
            };
            xhr.send(null);
        };

        this.createCaptcha = function (challenge) {
            //     <div id="img-9" class="captcha-img">
            //     <img src="img/car/7.jpg" alt="" width="100" height="100">
            //     <span class="overlay"></span>
            //     <span class="oi oi-circle-check text-primary" title="selected" aria-hidden="true"></span>
            //   </div>
            var cKey = Object.keys(challenge);

            // Captcha container
            var container = document.getElementById('captcha-block');

            for (var i = 0; i < challenge[cKey].images.length; i++) {
                // Div containter
                var div = document.createElement('div');
                div.classList.add('captcha-img');
                div.id = 'img-' + (i + 1);

                // Image
                var img = document.createElement('img');
                img.src = challenge[cKey].images[i];
                img.width = 100;
                img.height = 100;
                img.alt = "image-" + (i+1);

                // Overlay
                var overlay = document.createElement('span');
                overlay.classList.add('overlay');

                // Circle-check
                var circle = document.createElement('span');
                circle.classList.add('oi');
                circle.classList.add('oi-circle-check');
                circle.classList.add('text-primary');
                circle.title = "selected";
                circle.setAttribute('aria-hidden', 'true');

                // Add children to div
                div.appendChild(img);
                div.appendChild(overlay);
                div.appendChild(circle);

                // Append to captcha-block container
                container.appendChild(div);
            }

        };

        this.validateEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    var main = new iCaptcha();
    main.init();

})();
