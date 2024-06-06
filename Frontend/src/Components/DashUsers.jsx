import { current } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([])
    const [allPosts, setAllPosts] = useState([])

    const [usersIdDelete, setUsersIdDelete] = useState('')


    const [showModal, setShowModal] = useState(false)
    const [showMore, setShowMore] = useState(true)
    console.log(users);
    console.log(allPosts);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)

                    }
                }
                console.log(data);
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }


    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {

        setShowModal(false)
        try {
            const res = await fetch(`/api/user/delete/${usersIdDelete}`,
                {
                    method: 'DELETE',

                });
                const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUsers((prev) => prev.filter((user) => user._id !== usersIdDelete))
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

            {currentUser.isAdmin && users.length > 0 ?
                (
                    <section className=''>
                        <Table hoverable clasname='shadow-md '>
                            <Table.Head>
                                <Table.HeadCell>
                                    Date Created
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    User Image
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    UserName
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Email
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Rol
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    Delete
                                </Table.HeadCell>

                            </Table.Head>
                            {users.map((user) => (
                                <Table.Body key={user._id}>
                                    <Table.Row className='text-center'>
                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString('en-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace('.', '/')}</Table.Cell>
                                        <Table.Cell className='' >

                                            <img src={user.profilePicture} alt={'user Picture'} className='mx-auto rounded-[50px] w-20 h-10 object-cover bg-gray-500'></img>

                                        </Table.Cell>
                                        <Table.Cell >
                                            <p>{user.username}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p>{user.email}</p>
                                        </Table.Cell>
                                        <Table.Cell >
                                            {user.isAdmin === true ? (
                                                <p>Admin</p>
                                            ) : (
                                                <p>User</p>
                                            )}


                                        </Table.Cell>
                                        <Table.Cell >
                                            <button onClick={() => {

                                                setShowModal(true)
                                                setUsersIdDelete(user._id);
                                            }}>
                                                Delete
                                            </button>
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className='w-full text-teal-500 self-center text-sm py-7'
                            >
                                Show more
                            </button>
                        )}
                    </section>
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
                            <Button color='failure' onClick={handleDeleteUser} > Yes! </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}> Cancel! </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
