import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Route to create a regular user
router.post(
    '/create-user',
    UserController.createUser
);

router.get('/all-admin',
    auth(['admin', 'superAdmin']),
    UserController.getAllAdmin
)
router.get('/all-user',
    auth(['admin', 'superAdmin']),
    UserController.getAllUser
)
router.get('/:id',
    UserController.getSingleUser
)
router.get('/admin/:id',
    UserController.getSingleAdmin
)


router.patch('/:id',
    auth(['admin', 'superAdmin']),
    UserController.changeUserRole
)
router.patch('/status/:id',
    auth(['admin', 'superAdmin']),
    UserController.changeUserStatus
)

router.delete(
    '/:id',
    auth(['admin', 'superAdmin']),
    UserController.deleteUser);

router.delete('/admin/:id',
    auth(['admin', 'superAdmin']),
    UserController.deleteAdmin);


export const UserRoutes = router;
