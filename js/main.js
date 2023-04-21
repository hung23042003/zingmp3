const endPoint = "https://raw.githubusercontent.com/NVB07/m3-data/main/package.json";
const hostLink = "https://raw.githubusercontent.com/NVB07/m3-data/main/acssets/mp3/";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $(".playlist");
const audio = $("#audio");
const playBtn = $(".play");
const nextBtn = $(".next");
const prevBtn = $(".prev");
const progess = $(".progess");
const repeatBtn = $(".repeat");
const randomBtn = $(".shuffle");
const themeIcon = $(".theme-icon");

let currentIndex = 0;
let playing = false;
let isRepeat = false;
let isRandom = false;
let songList;




function run() {
    getApi(data => {
        const arraySong = data.mp3;
        mainApp.start(arraySong);
    })
}

run();
// get APi
function getApi (data) {
    fetch(endPoint)
        .then(response => response.json())
        .then(data)
        .catch(err => console.log(err))
}

const mainApp = {
    renderSong(arraySong) {
        const htmls = arraySong.map(song => {
            return `<div class="song">
                        <div class="song-image">
                            <img src="${song.image}" alt="">
                        </div>
                        <div class="song-descr">
                            <div class="song-descr-name">${song.name}</div>
                            <div class="song-descr-singer">${song.singer}</div>
                        </div>
                    </div>`
        });
        playList.innerHTML = htmls.join("");
        songList = $$(".song")
    },
    
    renderCurrentSong(arraySong) {
        $(".container").style.cssText = `background-image: url(${arraySong[currentIndex].image})`;
        $(".main-bg").style.cssText = `background-image: url(${arraySong[currentIndex].image})`;
        $(".header-name-song").textContent = arraySong[currentIndex].name;
        $(".header-name-singer").textContent = arraySong[currentIndex].singer;
        $(".header-name-singer").textContent = arraySong[currentIndex].singer;
        $(".header-image img").src = arraySong[currentIndex].image;
        
        audio.src = hostLink + arraySong[currentIndex].src ;
        songList[currentIndex].classList.add("now-play");
    },

    handleEvent(arraySong) {
        // dark mode
        themeIcon.addEventListener("click", () => {
            $(".main-bg-filter").classList.toggle("change-theme");
        });

        playBtn.addEventListener("click", () => {
            if(!playing) {
                generalFunction.playSong();
            } else {
                generalFunction.pauseSong();
            }
        });
        // xu ly tien do bai hat
        audio.addEventListener("timeupdate", () => {
            if(audio.duration) {
                let percent = audio.currentTime / audio.duration * 100;
                progess.value = `${percent}`;
                $(".sumTime").textContent = `${generalFunction.formatTimer(audio.duration)}`;
            }
            $(".curTime").textContent = `${generalFunction.formatTimer(audio.currentTime)}`;
        });
        // seek song (tua)
        progess.addEventListener("change", () => {
            playing = true;
            const curTime = (audio.duration / 100) * progess.value;
            audio.currentTime = curTime;
            generalFunction.playSong();
        });
        // next
        nextBtn.addEventListener("click", () => {
            if(isRandom) {
                generalFunction.randomSong(arraySong);
            }
            generalFunction.nextSong(arraySong);
        });
        // prev
        prevBtn.addEventListener("click", () => {
            if(isRandom) {
                generalFunction.randomSong(arraySong)
            } 
            generalFunction.backSong(arraySong);
        });
        // repeat song
        repeatBtn.addEventListener("click", () => isRepeat = repeatBtn.classList.toggle("active"));
        // random song
        randomBtn.addEventListener("click", () => isRandom = randomBtn.classList.toggle("active"));
        // when song end
        audio.addEventListener("ended", () => {
            if(isRepeat) {
                generalFunction.playSong();
            } else {
                generalFunction.nextSong(arraySong)
            }

        });


        // active song class when click
        [...songList].forEach((song, index) => {
            song.addEventListener("click", () => {
                generalFunction.removeActive();
                song.classList.add("now-play");
                currentIndex = index;
                this.renderCurrentSong(arraySong);
                generalFunction.playSong();
            })
        });
        
    },

    start (arraySong) {
        this.renderSong(arraySong);
        this.renderCurrentSong(arraySong);
        this.handleEvent(arraySong)
    }
    
}

const generalFunction = {
    removeActive() {
      const activeElements = $$(".now-play");
      [...activeElements].forEach(item => {
        item.classList.remove("now-play")
      })  
    },
    playSong() {
        audio.play();
        playing = true;
        playBtn.innerHTML = `<i class="fa-solid fa-pause btn-pause"></i>`;
    },

    pauseSong() {
        audio.pause();
        playing = false;
        playBtn.innerHTML = `<i class="fa-solid fa-play btn-play "></i>`;
    },

    nextSong(arraySong) {
        currentIndex++;
        if(currentIndex >= arraySong.length) {
            currentIndex = 0;
        }
        this.removeActive();
        mainApp.renderCurrentSong(arraySong);
        this.playSong();
    },

    backSong(arraySong) {
        currentIndex--;
        if(currentIndex < 0) {
            currentIndex = arraySong.length - 1;
        }
        this.removeActive();
        mainApp.renderCurrentSong(arraySong);
        this.playSong();
    },
    
    randomSong(arraySong) {
        let newCurrentIndex;
        do {
            newCurrentIndex = Math.floor(Math.random() * arraySong.length );
        } while(newCurrentIndex === currentIndex);
        currentIndex = newCurrentIndex;
        
    },

    formatTimer(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
}