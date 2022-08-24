const router = require('express').Router();
const {
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/me', getUser);
router.get('/users/:usersId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
