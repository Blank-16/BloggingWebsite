import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'
import appwriteService from '../appwrite/appwriteConfig'
import {Container , PostCard} from '../components/index'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { status } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                // If logged out, show all posts. If logged in, show only active posts
                const queries = status ? [Query.equal('status', 'active')] : []
                const result = await appwriteService.getPosts(queries)
                if (result && result.documents) {
                    setPosts(result.documents)
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [status])
    
    if (loading) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold text-gray-300'>
                                Loading posts...
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold text-gray-300'>
                                {status ? 'No active posts found' : 'No posts found'}
                            </h1>
                            <p className='text-gray-500 mt-2'>
                                {status ? 'Be the first to create a post!' : 'There are no posts available yet.'}
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-300 mb-2">
                        {status ? 'Active Posts' : 'All Posts'}
                    </h1>
                    <p className="text-gray-500">
                        {status ? 'Showing only active posts from your feed' : 'Showing all posts from everyone'}
                    </p>
                </div>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="py-2 w-1/4 m-2">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home