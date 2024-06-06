import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,

} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function DashProfile() {

  const { currentUser, error, loading } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null)
  const [username, setUsername] = useState(currentUser.username)
  const [FormData, setFormData] = useState({})
  const [ImageFileUploading, setImageFileUploading] = useState(false)
  const [UpdateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [UpdateUserError, setUpdateUserError] = useState(null)


 
  const [showModal, setshowModal] = useState(false)

  const [imageFileUploadError, setimageFileUploadError] = useState(null)
  const [imageFileUploadProgress, setimageFileUploadProgress] = useState(null)
  const filePickerRef = useRef()

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }

  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }


  }, [imageFile])

  console.log(currentUser.id);
  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read:
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setimageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;


        setimageFileUploadProgress(progress.toFixed(0));

      },
      (error) => {
        setimageFileUploadError('Could Not Upload Image')
        setimageFileUploadProgress(null)
        setimageFileUrl(null)
        setImageFile(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageFileUrl(downloadURL);
          setFormData({ ...FormData, profilePicture: downloadURL });
          setImageFileUploading(false)


        });
      }
    )
  };


  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.id]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(FormData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (ImageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
        setUpdateUserSuccess("User's profile updated successfully");

      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };


  const handleDelete = async (e) => {
    setshowModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',

      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };




  console.log(imageFileUploadError, imageFileUploadProgress);


  console.log(imageFile, imageFileUrl);
  return (
    <div className='max-w-lg  mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>


        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} />


        <div className='relative w-32 h-32 self-center' onClick={() => filePickerRef.current.click()}>

          {imageFileUploadProgress && (<CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
              root: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              },
              path: {
                stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
              }
            }}

          ></CircularProgressbar>)}
          <img className={`object-cover rounded-full w-full h-full border-8   ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
            src={imageFileUrl || currentUser.profilePicture}
            alt="UserPicture"

          />
        </div>
        {
          imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>
        }

        <TextInput defaultValue={currentUser.username} type='text' id='username' placeholder='username' onChange={handleChange}></TextInput>
        <TextInput defaultValue={currentUser.email} type='text' id='email' placeholder='email' onChange={handleChange}></TextInput>
        <TextInput defaultValue={currentUser.password} type='text' id='password' placeholder='Password' onChange={handleChange}></TextInput>
        
        
        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline
          disabled={loading || ImageFileUploading} >
          {loading ? 'Loading...' : 'Update'}

        </Button>

        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>

              <Button
                type='button'
                gradientDuoTone={'purpleToPink'}
                className='w-full'
              >
                Create A Post

              </Button>
            </Link>
          )
        }
      </form>
      <div className='text-red-600 flex justify-between mt-5'>
        <span onClick={() => setshowModal(true)}>Delete Account</span>
        <span onClick={handleSignout}>Sign Out</span>
      </div>
      {
        UpdateUserSuccess && (
          <Alert color={'success'} className='mt-5'>
            {UpdateUserSuccess}
          </Alert>
        )
      }
      {
        UpdateUserError && (
          <Alert color={'failure'} className='mt-5'>
            {UpdateUserError}
          </Alert>
        )
      }
      {
        error && (
          <Alert color={'failure'} className='mt-5'>
            {error}
          </Alert>
        )
      }
      <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure to delete your account?
            </h3>
            <div className='flex justify-center gap-8'>
              <Button color='failure' onClick={handleDelete}> Yes! </Button>
              <Button color='gray' onClick={() => setshowModal(false)}> Cancel! </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
