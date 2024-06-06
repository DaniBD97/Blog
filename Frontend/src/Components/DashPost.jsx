import { current } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPost() {
    const { currentUser } = useSelector((state) => state.user)
    const [userPosts, setUserPosts] = useState([])
    const [allPosts, setAllPosts] = useState([])

    const [postIdDelete, setPostIdDelete] = useState('')


    const [showModal, setShowModal] = useState(false)
    const [showMore, setShowMore] = useState(true)
    console.log(userPosts);
    console.log(allPosts);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
                const data = await res.json()
                if (res.ok) {
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false)

                    }
                }
                console.log(data);
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }


    }, [currentUser._id])


    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {

        }
    }

    const handleDeletePosts = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/post/deletepost/${postIdDelete}/${currentUser._id}`);
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdDelete))
            }

        } catch (error) {

        }
    }

    // useEffect(() => {
    //     const fetchAllPosts = async () => {
    //         try {
    //             const res = await fetch(`/api/post/getposts`)
    //             const data = await res.json()
    //             if (res.ok) {
    //                 setAllPosts(data.posts)
    //             }
    //             console.log(data);
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     };
    //     if (currentUser.isAdmin) {
    //         fetchAllPosts();
    //     }


    // }, [])



    // useEffect(() => {
    //     const fetchAllPosts = async () => {
    //         try {
    //             const res = await fetch(`/api/post/getposts`);
    //             const data = await res.json();
    //             if (res.ok) {
    //                 const postsWithUsers = await Promise.all(
    //                     data.posts.map(async (post) => {

    //CREAR LA RUTA PARA OBTENER A LOS USUARIOS
    //                         const userRes = await fetch(`/api/user/getUserById/${post.userId}`);
    //                         const userData = await userRes.json();
    //                         if (userRes.ok) {
    //                             post.user = userData.user;
    //                         }
    //                         return post;
    //                     })
    //                 );
    //                 setUserPosts(postsWithUsers);
    //             }
    //             console.log(data);
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     };

    //     if (currentUser.isAdmin) {
    //         fetchAllPosts();
    //     }
    // }, []);


    return (
        <div>

            {currentUser.isAdmin && userPosts.length > 0 ?
                (
                    <>
                        <Table hoverable clasname='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>
                                    Date Update
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Post Image
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Post Title
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Category
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Delete
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Edit
                                </Table.HeadCell>
                            </Table.Head>
                            {userPosts.map((post) => (
                                <Table.Body key={post.userId}>
                                    <Table.Row>
                                        <Table.Cell >{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell >
                                            <Link to={`/post/${post.slug}`}>
                                                <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500'></img>
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell >
                                            <p>{post.title}</p>
                                        </Table.Cell>
                                        <Table.Cell >
                                            <p>{post.category}</p>
                                        </Table.Cell>
                                        <Table.Cell >
                                            <button onClick={() => {

                                                setShowModal(true)
                                                setPostIdDelete(post._id);
                                            }}>
                                                Delete
                                            </button>
                                        </Table.Cell>
                                        <Table.Cell >
                                            <Link
                                                className='text-teal-500 hover:underline'
                                                to={`/update-post/${post._id}`}
                                            >
                                                <span>Edit</span>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} clasname='w-full'>
                                    Show More
                                </button>
                            )
                        }
                    </>
                )
                :
                (
                    <>
                        <p>You Have No Posts Yet!</p>
                    </>
                )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure to delete your account?
                        </h3>
                        <div className='flex justify-center gap-8'>
                            <Button color='failure' onClick={handleDeletePosts}> Yes! </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}> Cancel! </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
