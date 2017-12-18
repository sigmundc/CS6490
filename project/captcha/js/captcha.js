(function () {

    // @depracated GIF captcha
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
        this.currentChallenge = {};
        var self = this;
        this.deadline = new Date();
        this.timeInterval = undefined;

        this.init = function () {
            // Assign click event listener (event bubbling)
            var captchaBlock = document.getElementById('captcha-block');
            captchaBlock.onclick = this.selectImage;

            var form = document.getElementById('my-form');
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                var f = e.target;
                self.signUp();
            });
            // console.log(form);
            // Alternate way to submit
            // document.getElementById('btn-submit').onclick = this.signUp;

            // Refresh button
            document.getElementById('btn-refresh').onclick = this.refreshCaptcha;

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
            // console.log(self.selectedImages);
            // var cKey = Object.keys(self.currentChallenge);
            self.verifyCaptcha(self.selectedImages, self.currentChallenge.answers);
        }

        this.getCaptcha = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "data/challenges.json", true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        self.challenges = JSON.parse(xhr.responseText).challenges;

                        // Randomly select a challenge here
                        var rand = self.getRandomInt(0, self.challenges.length);
                        self.currentChallenge = self.challenges[rand];
                        self.createCaptcha(self.currentChallenge);
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
            // var cKey = Object.keys(challenge);

            // Captcha container
            var container = document.getElementById('captcha-block');

            for (var i = 0; i < challenge.images.length; i++) {
                // Div containter
                var div = document.createElement('div');
                div.classList.add('captcha-img');
                div.id = 'img-' + (i + 1);

                // Image
                var img = document.createElement('img');
                img.src = challenge.images[i];
                img.width = 100;
                img.height = 100;
                img.alt = "image-" + (i + 1);

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

            // Add audio player - audio challenge
            var audio = document.createElement('audio');
            audio.id = 'captcha-player';
            audio.src = challenge.audio;
            document.getElementById('captcha-block').appendChild(audio);

            // Set timer for 50 seconds
            document.getElementById('timer-text').innerHTML = 'Refresh in ';
            clearInterval(self.timeInterval);
            var timeLimit = 50;
            var currentTime = Date.parse(new Date());
            self.deadline = new Date(currentTime + timeLimit * 1000);
            self.startTimer('refresh-timer', self.deadline);
        };

        /**
         * Source: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
         */
        this.startTimer = function (id, endtime) {
            var timer = document.getElementById(id);

            function updateTimer () {
                var t = self.getTimeRemaining(endtime);
                var timer = document.getElementById('refresh-timer');
                timer.innerHTML = t.seconds + 's';
    
                if (t.total <= 0) {
                    // clearInterval(self.timeInterval);
                    self.refreshCaptcha();
                }
            };
            updateTimer();
            self.timeInterval = setInterval(updateTimer, 1000);
        };

        this.getTimeRemaining = function (endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };

        this.refreshCaptcha = function () {
            self.selectedImages = [];
            console.log("refreshing captcha")
            
            // Reset timer
            clearInterval(self.timeInterval);
            document.getElementById('refresh-timer').innerHTML = '';
            document.getElementById('timer-text').innerHTML = 'Refreshing...';

            // Remove existing images
            var block = document.getElementById('captcha-block');
            block.innerHTML = "";
            var rand = self.getRandomInt(0, self.challenges.length);
            self.currentChallenge = self.challenges[rand];

            setTimeout(function () {
                self.createCaptcha(self.currentChallenge);
            }, 1000);
        };

        this.getRandomInt = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        this.verifyCaptcha = function (userInput, answers) {
            var notMatch = false;
            if (answers.length != userInput.length) {
                notMatch = true;
            } else {
                for (var j = 0; j < userInput.length; j++) {
                    if (answers.indexOf(userInput[j]) === -1) {
                        notMatch = true;
                        break;
                    }
                }
            }
            if (notMatch) {
                console.log("Captcha challenge failed.");
                alert("Hmm, Captcha challenge failed!");
                console.log("user input: ");
                console.log(userInput);

                console.log("answers: ");
                console.log(answers);
            } else {
                console.log("Captcha challenge passed!");
                alert("Captcha challenge passed!");
            }
            self.refreshCaptcha();
        }

        this.validateEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    var main = new iCaptcha();
    main.init();

})();
