const express = require('express');
const router = express.Router();
const musicController = require('../controller/spotifycontrol');

router.get('/', musicController.getMusicList); 
router.get('/index', musicController.getMusicList); 
router.post('/addmusic', musicController.uploadMusic); //insert sa database
router.get('/addmusic', musicController.renderAddMusicPage); //para maview lng ang page
router.get('/update/:id', musicController.getUpdateSong); //kukunin ang info para sa update
router.post('/update/:id', musicController.updateSong); //mag uupdate ng song
router.post('/delete/:id', musicController.deleteSong);

router.post('/add-to-playlist', musicController.addToPlaylist);

router.get('/playlist', musicController.renderPlaylistPage);


router.get('/playsong/:id', musicController.getSongDetails); // Fetch info for playing a song

router.get('/playlistplay/:id', musicController.getSongPlaylist); // Fetch info for the playlist
router.get('/playlist/:playlistId', musicController.getPlaylist);
router.post('/removeplaylist/:id', musicController.removePlaylist);

router.post('/removeplaylist/:id', musicController.removePlaylist);



module.exports = router;
