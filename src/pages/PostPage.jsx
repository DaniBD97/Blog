import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import CommentSection from '../Components/CommentSection';
import PostCard from '../Components/PostCard';
import CallToAction from '../components/CallToAction';
import { useSelector } from 'react-redux';
import { FaRegComments } from "react-icons/fa6";

export default function PostPage() {
    const { postSlug } = useParams()
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null)
    const [comments, setComments] = useState([]);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);


    useEffect(() => {
        const getComments = async () => {
            if (post?._id) {
                try {
                    const res = await fetch(`/api/comment/getPostComments/${post._id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setComments(data);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        };
        getComments();
    }, [post?._id]);




    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`)
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts)
                }
            };
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
        }

    }, []);



    if (loading) return (
        <div className="flex justify-center items-center ">
            <Spinner size={'xl'}></Spinner>
        </div>
    )


    return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>


        {post &&
            <>

                <img src={post.image} alt={post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />


                <div className='flex justify-between'>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{(post.content.length / 1000).toFixed(0)} mins read</span>

                </div>
                <div className='text-sm flex-row my-5 justify-start flex  gap-1'>

                    <section className='bg-slate-50 font-bold h-fit p-2 dark:text-[#ffffff] dark:bg-[#262626] rounded-md'>

                        <div className='gap-1 mt-1 justify-start flex-col  flex py-1 px-2 rounded-sm'>
                             @{currentUser?.username}
                            <section className='flex items-center gap-2 text-left'>
                               
                                    <p><FaRegComments /></p>
                                    <p className='text-left flex'>{comments.length}</p>
                               


                            </section>


                        </div>
                        <Link to={`/search?category=${post.category}`}>
                            <Button className='capitalize' color='transparent' pill size={'xs'}>{post.category}</Button>
                        </Link>
                    </section>
                    <section className='ml-5  '>
                        <h1 className='text-3xl mb-3  font-serif max-w-2xl mx-auto lg:text-4xl'>{post.title}</h1>
                        <span className='p-3 max-w-2xl mx-auto w-full post-content'>{(post.sinapsis)}</span>
                        <div className='p-3 max-w-2xl mx-auto w-full  post-content' dangerouslySetInnerHTML={{ __html: post.content }}>


                        </div>

                    </section>


                </div>



                <CommentSection postId={post._id} />
                <div className='flex justify-center'>
                    <CallToAction />
                </div>
                <div className='flex flex-col justify-center items-center mb-5'>
                    <h1 className='text-xl mt-5'>Recent Articles</h1>
                    <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                        {
                            recentPosts &&
                            recentPosts.map((post) => (
                                <PostCard key={post._id} post={post} />)
                            )
                        }

                    </div>
                </div>


            </>

        }



    </main>



}
