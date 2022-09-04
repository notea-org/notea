import { api } from 'libs/server/connect';
import { useAuth } from 'libs/server/middlewares/auth';

export default api()
    .use(useAuth)
    .get(async (req, res) => {
        const user = req.session.get('user');

        res.json(user);
    });
