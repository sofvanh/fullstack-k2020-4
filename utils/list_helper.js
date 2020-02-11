const totalLikes = (blogs) => {
    return (blogs.reduce((total, blog) => total + blog.likes, 0))
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return (blogs.reduce((oldFave, blog) => {
        if (oldFave === null) return (blog)
        else {
            if (blog.likes > oldFave.likes) return blog
            else return oldFave
        }
    }))
}

module.exports = {
    totalLikes,
    favoriteBlog
}