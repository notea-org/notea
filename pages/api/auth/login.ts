import { api } from 'libs/server/connect';
import { authenticate } from 'libs/server/auth';

export default api().post(async (req, res) => {
    const authenticationData = await authenticate(req);
    if (!authenticationData) {
        return res.APIError.NEED_LOGIN.throw();
    }

    const user = {
        isLoggedIn: true,
    };
    req.session.set('user', user);
    await req.session.save();

    res.json(user);
});
