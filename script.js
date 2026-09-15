// ========================================
// ABRAHAM ELI MUSIC PLAYER
// CORRECTED JAVASCRIPT
// ========================================


// ========================================
// GET HTML ELEMENTS
// ========================================

const audioPlayer1 = document.getElementById("audioPlayer1");
const audioPlayer2 = document.getElementById("audioPlayer2");
const audioPlayer3 = document.getElementById("audioPlayer3");

const albumCover = document.getElementById("albumCover");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");

const volumeBar = document.getElementById("volumeBar");

const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const playlistItems = document.getElementById("playlistItems");
const autoplayToggle = document.getElementById("autoplayToggle");

const musicPlayer = document.querySelector(".music-player");


// ========================================
// SONG DATA
// ORDER: SUNNY → DREAMS → MEMORIES
// ========================================

const songs = [

    {
        title: "Sunny",
        artist: "Benjamin Scott",
        audio: audioPlayer1,
        cover: "sunny.jpeg"
    },

    {
        title: "Dreams",
        artist: "Benjamin Scott",
        audio: audioPlayer2,
        cover: "dreams.jpeg"
    },

    {
        title: "Memories",
        artist: "Benjamin Scott",
        audio: audioPlayer3,
        cover: "memories.jpeg"
    }

];


// ========================================
// CURRENT SONG
// ========================================

let songIndex = 0;

let audioPlayer = songs[songIndex].audio;


// ========================================
// PREPARE AUDIO
// ========================================

songs.forEach((song) => {

    song.audio.preload = "metadata";

    song.audio.volume = Number(volumeBar.value);

});


// ========================================
// LOAD SONG
// ========================================

function loadSong(index) {

    const song = songs[index];


    // Stop all audio
    songs.forEach((item) => {

        item.audio.pause();

        item.audio.currentTime = 0;

    });


    // Set current audio
    audioPlayer = song.audio;


    // Update song title
    songTitle.textContent = song.title;


    // Update artist
    artistName.textContent = song.artist;


    // Update album cover
    albumCover.src = song.cover;

    albumCover.alt = `${song.title} album cover`;


    // Reset progress
    currentTime.textContent = "0:00";

    duration.textContent = "0:00";

    progressBar.value = 0;


    // Load selected audio
    audioPlayer.load();


    // Update playlist
    updatePlaylist();

}


// ========================================
// PLAY SONG
// ========================================

function playSong() {

    audioPlayer.play()

        .then(() => {

            playBtn.textContent = "⏸";

            playBtn.setAttribute(
                "aria-label",
                "Pause"
            );

            musicPlayer.classList.add("playing");

        })

        .catch((error) => {

            console.log(
                "Unable to play audio:",
                error
            );

        });

}


// ========================================
// PAUSE SONG
// ========================================

function pauseSong() {

    audioPlayer.pause();

    playBtn.textContent = "▶";

    playBtn.setAttribute(
        "aria-label",
        "Play"
    );

    musicPlayer.classList.remove("playing");

}


// ========================================
// PLAY / PAUSE
// ========================================

function togglePlay() {

    if (audioPlayer.paused) {

        playSong();

    } else {

        pauseSong();

    }

}


// ========================================
// NEXT SONG
// ========================================

function nextSong() {

    songIndex++;

    if (songIndex >= songs.length) {

        songIndex = 0;

    }

    loadSong(songIndex);

    playSong();

}


// ========================================
// PREVIOUS SONG
// ========================================

function previousSong() {

    songIndex--;

    if (songIndex < 0) {

        songIndex = songs.length - 1;

    }

    loadSong(songIndex);

    playSong();

}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(time) {

    if (isNaN(time)) {

        return "0:00";

    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateProgress() {

    if (!audioPlayer.duration) {

        return;

    }

    const progress =
        (audioPlayer.currentTime /
            audioPlayer.duration) * 100;

    progressBar.value = progress;

    currentTime.textContent =
        formatTime(audioPlayer.currentTime);

}


// ========================================
// SET DURATION
// ========================================

function setDuration() {

    duration.textContent =
        formatTime(audioPlayer.duration);

}


// ========================================
// SEEK THROUGH SONG
// ========================================

function seekSong() {

    if (!audioPlayer.duration) {

        return;

    }

    const seekTime =
        (progressBar.value / 100) *
        audioPlayer.duration;

    audioPlayer.currentTime = seekTime;

}


// ========================================
// CHANGE VOLUME
// ========================================

function changeVolume() {

    const volume =
        Number(volumeBar.value);

    songs.forEach((song) => {

        song.audio.volume = volume;

    });

}


// ========================================
// UPDATE PLAYLIST
// ========================================

function updatePlaylist() {

    const items =
        playlistItems.querySelectorAll(
            ".playlist-item"
        );

    items.forEach((item, index) => {

        if (index === songIndex) {

            item.classList.add("active");

        } else {

            item.classList.remove("active");

        }

    });

}


// ========================================
// PLAYLIST CLICK
// ========================================

const playlistSongItems =
    playlistItems.querySelectorAll(
        ".playlist-item"
    );


playlistSongItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const selectedSong =
                Number(item.dataset.song) - 1;


            if (
                selectedSong >= 0 &&
                selectedSong < songs.length
            ) {

                songIndex = selectedSong;

                loadSong(songIndex);

                playSong();

            }

        }
    );

});


// ========================================
// SONG ENDED
// ========================================

songs.forEach((song) => {

    song.audio.addEventListener(
        "ended",
        () => {

            if (song.audio !== audioPlayer) {

                return;

            }


            if (autoplayToggle.checked) {

                nextSong();

            } else {

                playBtn.textContent = "▶";

                playBtn.setAttribute(
                    "aria-label",
                    "Play"
                );

                musicPlayer.classList.remove(
                    "playing"
                );

            }

        }
    );

});


// ========================================
// TIME UPDATE
// ========================================

songs.forEach((song) => {

    song.audio.addEventListener(
        "timeupdate",
        () => {

            if (song.audio === audioPlayer) {

                updateProgress();

            }

        }
    );

});


// ========================================
// LOAD DURATION
// ========================================

songs.forEach((song) => {

    song.audio.addEventListener(
        "loadedmetadata",
        () => {

            if (song.audio === audioPlayer) {

                setDuration();

            }

        }
    );

});


// ========================================
// PLAY BUTTON
// ========================================

playBtn.addEventListener(
    "click",
    togglePlay
);


// ========================================
// NEXT BUTTON
// ========================================

nextBtn.addEventListener(
    "click",
    nextSong
);


// ========================================
// PREVIOUS BUTTON
// ========================================

previousBtn.addEventListener(
    "click",
    previousSong
);


// ========================================
// PROGRESS BAR
// ========================================

progressBar.addEventListener(
    "input",
    seekSong
);


// ========================================
// VOLUME BAR
// ========================================

volumeBar.addEventListener(
    "input",
    changeVolume
);


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        // Space = Play / Pause
        if (event.code === "Space") {

            event.preventDefault();

            togglePlay();

        }


        // Right Arrow = Next
        else if (event.key === "ArrowRight") {

            nextSong();

        }


        // Left Arrow = Previous
        else if (event.key === "ArrowLeft") {

            previousSong();

        }


        // Up Arrow = Increase Volume
        else if (event.key === "ArrowUp") {

            event.preventDefault();

            volumeBar.value =
                Math.min(
                    1,
                    Number(volumeBar.value) + 0.1
                );

            changeVolume();

        }


        // Down Arrow = Decrease Volume
        else if (event.key === "ArrowDown") {

            event.preventDefault();

            volumeBar.value =
                Math.max(
                    0,
                    Number(volumeBar.value) - 0.1
                );

            changeVolume();

        }

    }
);


// ========================================
// INITIALIZE PLAYER
// ========================================

// Start with Sunny
songIndex = 0;

changeVolume();

loadSong(songIndex);
