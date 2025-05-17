import User from '../models/user.model';

const createUser = async (data: any) => {
    const user = new User(data);
    return await user.save();
};

export default { createUser };
