import { TextInput } from 'flowbite-react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { updateSuccess } from '../redux/user/userSlice';

export default function ResetPassword() {
    const { currentUser } = useSelector(state => state.user);
    const [UpdateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [UpdateUserError, setUpdateUserError] = useState(null)
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(FormData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/updatePassword/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FormData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setimageFileUploadProgress(false)
                setUpdateUserSuccess("Password Change Succesfully");

            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>



                <TextInput defaultValue={currentUser.password} type='text' id='password' placeholder='Password' onChange={handleChange}></TextInput>


            </form>
        </div>
    )
}
