const path = require('path');
const musicModel = require('../models/Userinfo');
const multer = require('multer');
const { exit } = require('process');

//kukunin lahat ng list ng nasa database
const getMusicList = (req, res) => {
    musicModel.getAllMusic((err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving music from the database');
        }
        res.render('index', { musicList: results }); // Make sure 'index' is your view file
    });
};


// para maview ang addmusic.ejs
const renderAddMusicPage = (req, res) => {
    res.render('addmusic');
};


//kukunin ang info ng songpara kay music play
const getSongDetails = (req, res) => {
    const songId = req.params.id; 
    musicModel.getMusicById(songId, (err, song) => {
        if (err || !song) {
            return res.status(404).send('Song not found');
        }
        res.render('playsong', { song: song }); 
    });
};

const getSongPlaylist = (req, res) => {
    const songId = req.params.id; 
    musicModel.getMusicById(songId, (err, song) => {
        if (err || !song) {
            return res.status(404).send('Song not found');
        }
        res.render('playlistplay', { song: song }); 
    });
};


//para mag update ng song
//para mag update ng song
const updateSong = (req, res) => {
    const songId = req.params.id; 
    const SongName = req.body.SongName; 
    const Author = req.body.Author;
    const lyrics = req.body.lyrics;

    console.log(songId, SongName, Author, lyrics); // Logs for debugging

    // Ensure that the model function accepts the lyrics field
    musicModel.updateSong(songId, { SongName, Author, lyrics })
        .then(() => {
            res.redirect(`/playsong/${songId}`); // Redirect to the song page after update
        })
        .catch((err) => {
            console.error('Error updating song:', err); // Log the error for debugging
            res.status(500).send('Error updating music in the database');
        });
};





//kukunin ang info para nmn sa update
const getUpdateSong = (req, res) => {
    const songId = req.params.id;

    musicModel.getMusicById(songId, (err, song) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving song');
        }
        if (!song) {
            return res.status(404).send('Song not found');
        }
        res.render('updatesong', { song }); 
    });
};




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the folder based on the file type
        if (file.fieldname === 'music') {
            cb(null, './public/music'); // Store music files
        } else if (file.fieldname === 'picture') {
            cb(null, './public/images'); // Store picture files
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // Max file size 10MB
}).fields([
    { name: 'music', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]);


//para makapag post or add sa database ng song
const uploadMusic = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        const songName = req.body.SongName;
        const Author = req.body.Author;
        const lyrics = req.body.lyrics;
        const musicFilePath = `music/${req.files.music[0].filename}`; 
let pictureFilePath = null;

if (req.files.picture) {
    pictureFilePath = `images/${req.files.picture[0].filename}`;
}


        musicModel.insertMusic({ songName, Author, musicFilePath, pictureFilePath }, (err) => {
            if (err) {
                return res.status(500).send('Error saving music to the database');
            }
            res.redirect('/'); 
        });
    });
};



const deleteSong = (req, res) => {
    const songId = req.params.id;

    musicModel.deleteSong(songId, (err) => {
        if (err) {
            console.error('Error deleting song:', err);
            return res.status(500).send('Error deleting song from the database');
        }
        res.redirect('/playlist'); // Redirect after deletion
    });
};














// Controller to add song to playlist
const addToPlaylist = (req, res) => {
    const songId = req.body.song_id; 
    musicModel.addToPlaylist(songId)
        .then(() => {
            console.log("Song added to playlist successfully.");
            res.redirect(`/playsong/${songId}`); 
        })
        .catch(err => {
            console.error("Error adding song to playlist:", err);
            res.status(500).send("Error adding song to playlist");
        });
};

// musicController.js

const renderPlaylistPage = (req, res) => {
    musicModel.getSongsplaylist((err, results) => {
        if (err) {
            console.error('Error retrieving music from the database:', err); 
            return res.status(500).send('Error retrieving music from the database');
        }
        res.render('playlist', { musicList: results }); 
    });
};




const getPlaylist = (req, res) => {
    const playlistId = req.params.playlistId; 
    musicModel.getSongsByPlaylistId(playlistId, (err, songs) => {
        if (err) {
            return res.status(500).send('Error retrieving playlist data');
        }
        res.render('playlistplay', { songs }); 
    });
};

const removePlaylist = (req, res) => {
    const songId = req.params.id;
    console.log('Received request to remove song with ID:', songId); // Add this line

    musicModel.removePlaylist(songId, (err, result) => {
        if (err) {
            console.error('Error removing song from playlist:', err);
            return res.status(500).send('Error removing song from playlist');
        }
        res.redirect('/playlist');
    });
};

const deleteSongFromPlaylist = (req, res) => {
    const songId = req.params.songId;

    musicModel.removeSongFromPlaylist(req.user.id, songId) // Pass user ID if needed
        .then(() => {
            res.status(200).send('Song deleted from playlist successfully');
        })
        .catch(err => {
            console.error('Error deleting song from playlist:', err);
            res.status(500).send('Error deleting song from playlist');
        });
};
        // Add this function to the exports
        module.exports = {
            // other functions,
            deleteSongFromPlaylist,
        };


module.exports = { uploadMusic, getMusicList, renderAddMusicPage, getSongDetails, updateSong, addToPlaylist, getUpdateSong, deleteSong, renderPlaylistPage, getPlaylist,removePlaylist, getSongPlaylist };