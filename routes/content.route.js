const express = require('express')
const router = express.Router()

const {createContent,readAllContents,readContentById,userSpecificContent,approveContent,rejectContent,contentStats,recentContents} = require('../controllers/content.controller')

const {verifyToken,authorizeUser} = require('../middlewares/auth.middle')

router.post('/',verifyToken,authorizeUser('user'),createContent)

router.get('/',verifyToken,authorizeUser('admin'),readAllContents)

router.get('/stats',verifyToken,authorizeUser('admin'),contentStats)

router.get('/recent',verifyToken,authorizeUser('admin'),recentContents)

router.get('/user/:id',verifyToken,authorizeUser('user'),userSpecificContent)

router.get('/:id',verifyToken,authorizeUser('admin'),readContentById)

router.put('/:id/approve',verifyToken,authorizeUser('admin'),approveContent)

router.put('/:id/reject',verifyToken,authorizeUser('admin'),rejectContent)



module.exports = router;