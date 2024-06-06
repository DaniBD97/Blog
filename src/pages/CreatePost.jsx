import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const BlockEmbed = Quill.import("blots/block/embed");
const Link = Quill.import("formats/link");

class EmbedResponsive extends BlockEmbed {
  static blotName = "embed-responsive";
  static tagName = "DIV";
  static className = "embed-responsive";

  static create(value) {

    const node = super.create(value);
    node.classList.add("embed-responsive-16by9");

    const child = document.createElement("iframe");
    child.setAttribute('frameborder', '0');
    child.setAttribute('allowfullscreen', true);
    child.setAttribute('src', this.sanitize(value));
    child.classList.add("embed-responsive-item");

    node.appendChild(child);

    return node;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    const iframe = domNode.querySelector('iframe');
    return iframe.getAttribute('src');
  }
}

Quill.register(EmbedResponsive);

export default function CreatePost() {
  const [file, setfile] = useState(null)
  const [formData, setFormData] = useState({})
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null)

  const navigate = useNavigate();



  const handleUpload = async () => {
    try {
      if (!file) {
        setImageUploadError('PLease select an image')
        return;
      }
      setImageUploadError(false)
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );


    } catch (error) {
      setImageUploadError('Image Upload Failed')
      setImageUploadProgress(null)

    }

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video'
  ];



  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create A post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='title required'
            required id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}

          />
          <TextInput
            type='text'
            placeholder='sinapsis required'
            required id='sinapsis'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, sinapsis: e.target.value })}

          />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value='uncategorized'>Select a Category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>

        </div>
        <div className='flex gap-4
         items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => setfile(e.target.files[0])}></FileInput>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpload}
            disabled={imageUploadProgress}
          >
            {
              imageUploadProgress ?
                (<div>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>) : (
                  'Upload Image'
                )

            }
          </Button>

        </div>
        {
          imageUploadError && (
            <Alert color={'failure'}>{imageUploadError}</Alert>
          )
        }
        {
          formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className='w-full h-72 object-cover'
            />
          )
        }
        <ReactQuill
          theme='snow'
          modules={modules}
          formats={formats}

          placeholder='Write something...'
          className='h-72 mb-12 w-[100%] border-slate-400'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}

        />
        <Button type='submit' gradientDuoTone={'purpleToPink'}>
          Publish
        </Button>
        {
          publishError && <Alert className='mt-5' color={'failure'}>{publishError}</Alert>
        }
      </form>
    </div>
  )
}
